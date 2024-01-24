import bcrypt from "bcrypt";
import { hashUserPassword, checkUserEmail, checkUserById } from "./Components";
import userDAL from "../DAL/User"
import { includes } from "lodash";

const salt = bcrypt.genSaltSync(10);

const getUser = async (data) => {
  try {
    let userId = data.query.id
    if (!userId) {
      throw {
        code: 406,
        message: `Missing your parameter`
      }
    }

    let user = await checkUserById(userId)
    if (!user) {
      throw {
        code: 400,
        message: `Your's email isn't exist`
      }
    }
    return user
  } catch (e) {
    throw e
  }
};

const createNewUserBLL = async (data) => {
  try {
    let email = data.email;
    let phone = data.phone;
    let role = data.role;
    let password = data.password;

    if (!email || !password || !role || !phone) {
      return {
        message: "Missing required parameters",
        code: 2
      }
    }
    let isExist = await checkUserEmail(email);
    if (!isExist) {
      let hashPassword = hashUserPassword(password);
      data.password = hashPassword
      let response = await userDAL.createNewUserDAL(data)
      return {
        message: response.message,
        code: response.code
      }
    } else {
      return {
        message: "The email is already exist",
        code: 0
      }
    }
  } catch (e) {
    console.log(e);
    return {
      message: `Server error`,
      code: 0,
    };
  }
};

const testJson = async (data) => {
  try {
    console.log(data)
    // let response = await userDAL.testJson(data)
    // return {
    //   message: response.message,
    //   code: response.code
    // }
  } catch (e) {
    console.log(e);
  }
};

const updateUserBLL = async (data) => {
  try {
    let id = data.id
    let email = data.email;
    let phone = data.phone;
    let role = data.role;

    if (!id || !email || !role || !phone) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    const user = await checkUserById(data.id)
    if (!user) {
      throw {
        code: 400,
        message: `Your's email isn't exist`
      }
    }

    let existingUserWithEmail = await checkUserEmail(data.email)
    if (user.email === email) {
      existingUserWithEmail = false
    }
    if (!existingUserWithEmail) {
      await userDAL.updateUserDAL(data);
      return {
        message: `Update user successfully!`,
      };
    } else {
      throw {
        message: "The email is already exist",
        code: 403,
      };
    }

  } catch (e) {
    throw e
  }
};

const getAllUsersBLL = async (data) => {
  try {
    let response = await userDAL.getAllUsersDAL(data)
    return response
  } catch (e) {
    throw e
  }
};

const getAllAssignBLL = async (data) => {
  try {
    let response = {}

    if (!data.role) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    response = await userDAL.getAllUsersDAL({
      email: '',
      role: data.role
    })
    return response
  } catch (e) {
    throw e
  }
};

const getUserWithPaginationBLL = async (page, limit) => {
  try {
    let response = await userDAL.getUserWithPaginationDAL(page, limit)
    return response
  } catch (e) {
    console.log(e);
  }
};

const changePasswordBLL = async (data) => {
  try {
    console.log(data)
    let userId = data.id
    let password = data.password
    if (!userId || !password) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    let hashPassword = hashUserPassword(password);
    await userDAL.changePasswordDAL(userId, hashPassword)
    return {
      message: "Update password successfully!"
    }
  } catch (e) {
    throw e
  }
}

const changeStatusAccountBLL = async (data) => {
  try {
    let userId = data.id
    if (!userId) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    let account = await userDAL.findAccountByUserId(userId);
    if (!account) {
      throw {
        code: 400,
        message: `Your's email isn't exist`
      }
    }

    if (account.status.includes('Active')) {
      await userDAL.changeStatusAccountDAL(data, 'Inactive');
    } else {
      await userDAL.changeStatusAccountDAL(data, 'Active');
    }
    return {
      message: "Update status account successfully!"
    }
  } catch (e) {
    throw e
  }
}

module.exports = {
  createNewUserBLL,
  updateUserBLL,
  getUser,
  getAllUsersBLL,
  getUserWithPaginationBLL,
  changePasswordBLL,
  changeStatusAccountBLL,
  testJson,
  getAllAssignBLL,
};