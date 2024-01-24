import bcrypt from "bcrypt";
import authDAL from "../DAL/Auth";
const salt = bcrypt.genSaltSync(10);
import userDAL from "../DAL/User";

const checkUserEmail = async (email) => {
  try {
    let user = await authDAL.findUserByEmail(email);
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    throw e
  }
};

const hashUserPassword = (password) => {
  try {
    let hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword
  } catch (e) {
    console.log(e);
  }
}

const checkUserById = async (userId) => {
  try {
    let user = await userDAL.findOneUser(userId)
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {
    throw e
  }
};

module.exports = {
  checkUserEmail,
  hashUserPassword,
  checkUserById
};