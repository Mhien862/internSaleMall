import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authDAL from "../DAL/Auth";
import { errCode } from "../utils/constant"
import sendEmail from "../utils/sendEmail";
// import userBLL from "./User"
import { hashUserPassword, checkUserEmail } from "./Components";

const createToken = (data) => {
  let payload = data.payload
  let token = jwt.sign(
    { payload },
    data.secret, {
    algorithm: data.alg,
    expiresIn: data.exp,
  });
  return token;
};

const verifyToken = (token, secret) => {
  try {
    let decoded = jwt.verify(token, secret);
    return decoded
  } catch (error) {
    return false;
  }
}

const createAccessToken = (userName) => {
  let accessToken = jwt.sign(
    { username: userName },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "5m",
    }
  );

  return accessToken;
};

const createRefreshToken = (userName) => {
  let refreshToken = jwt.sign(
    { username: userName },
    process.env.REFRESH_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "1d",
    }
  );
  return refreshToken;
};

const refreshToken = async (refreshToken) => {
  let data = {};
  try {
    let decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decoded) {
      let isExist = await checkUserEmail(decoded.username);
      if (isExist) {
        let accessToken = createAccessToken(decoded.username);
        let user = await authDAL.findUserByEmail(decoded.username);
        data.errCode = errCode.successCode;
        data.message = `Get refresh token successfully!`;
        data.accessToken = accessToken;
        data.user = user;
      } else {
        data.errCode = errCode.wrongEmailCode;
        data.message = `Your's email isn't exist`;
      }
    } else {
      data.errCode = errCode.wrongTokenCode
      data.message = "Invalid or expired password reset token!";
    }
  } catch (e) {
    console.log(e)
    data.errCode = errCode.errServerCode;
    data.message = `Server error`;
  }
  return data;
};

const getAccount = async (user) => {
  let data = {};
  try {
    let isExist = await checkUserEmail(user);
    if (isExist) {
      data.errCode = errCode.successCode;
      data.message = `Get user successfully!`;
      data.user = isExist;
    } else {
      data.errCode = errCode.wrongEmailCode;
      data.message = `Your's email isn't exist`;
    }
  } catch (e) {
    data.errCode = errCode.errServerCode;
    data.message = `Server error`;
  }
  return data;
}

const handleLoginBLL = async (data) => {
  let userData = {};
  try {
    let accessToken = createAccessToken(data.email);
    let refreshToken = createRefreshToken(data.email);
    let isExist = await checkUserEmail(data.email);
    if (isExist) {
      let user = await authDAL.findUserAccountByEmail(data.email)
      if (user.account.status.includes('Active')) {
        let check = bcrypt.compareSync(data.password, user.account.password);
        if (check) {
          delete user.dataValues.account;
          userData.errCode = errCode.successCode;
          userData.message = `Authenticate user successfully!`;
          userData.accessToken = accessToken;
          userData.refreshToken = refreshToken;
          userData.user = user;
        } else {
          userData.errCode = errCode.wrongPassCode;
          userData.message = `Your password is wrong`;
        }
      } else {
        userData.message = `Your account inactive`;
        userData.errCode = errCode.wrongEmailCode;
      }
    } else {
      userData.message = `Your email doesn't exist`;
      userData.errCode = errCode.wrongEmailCode;
    }
  } catch (e) {
    userData.errCode = errCode.errServerCode
    userData.message = `Server error`;
  }
  return userData
};

const forgotPassword = async (data) => {
  let forgotData = {}
  try {
    let user = await authDAL.findUserByEmail(data.email);
    if (user) {
      let dataToken = {
        payload: data.email,
        secret: process.env.ACCESS_TOKEN_SECRET,
        alg: "HS256",
        exp: "1d",
      }
      let passwordResetToken = createToken(dataToken)
      await authDAL.updateForgotPassword(user.id, passwordResetToken)

      let resetUrl = `http://${data.host}/reset-password?token=${passwordResetToken}`;
      let subject = "Password Reset Request";
      let html = `
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset your password here</a>
        `;

      await sendEmail.sendEmail(html, subject, data.email);

      forgotData.message = `Password reset email sent`;
      forgotData.errCode = errCode.successCode;
    } else {
      forgotData.message = `Your email doesn't exist`;
      forgotData.errCode = errCode.wrongEmailCode;
    }
  } catch (error) {
    forgotData.errCode = errCode.errServerCode
    forgotData.message = `Server error`;
  }
  return forgotData
};

const resetPassword = async (data) => {
  let resetData = {}
  try {
    let account = await authDAL.findAccountByToken(data.passwordResetToken);
    if (account) {
      let decoded = verifyToken(data.passwordResetToken, process.env.ACCESS_TOKEN_SECRET)
      if (decoded) {
        let hash = await hashUserPassword(data.password);
        await authDAL.resetPassword(account.id, hash);
        resetData.errCode = errCode.successCode;
        resetData.message = "Reset Password successfully";
      } else {
        resetData.errCode = errCode.wrongTokenCode
        resetData.message = "Invalid or expired password reset token!";
      }
    } else {
      resetData.errCode = errCode.wrongTokenCode
      resetData.message = "Invalid or expired password reset token!";
    }
  } catch (e) {
    resetData.errCode = errCode.errServerCode
    resetData.message = `Server error`;
  }
  return resetData;
};

module.exports = {
  refreshToken,
  handleLoginBLL,
  forgotPassword,
  resetPassword,
  getAccount
};