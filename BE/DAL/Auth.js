import db from "../models/index";

const findUserByEmail = async (email) => {
  try {
    let user = await db.users.findOne({
      where: { email: email },
    });
    return user;
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const findUserAccountByEmail = async (email) => {
  try {
    let user = await db.users.findOne({
      include: [{ model: db.accounts, raw: true, }],
      where: { email: email },
    });
    return user;
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const updateForgotPassword = async (id, token) => {
  try {
    await db.accounts.update({
      token: token
    },
      { where: { user_id: id } },
    );
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const findAccountByToken = async (token) => {
  try {
    let account = await db.accounts.findOne({
      where: { token: token },
    });
    return account;
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const resetPassword = async (id, password) => {
  try {
    await db.accounts.update({
      password: password,
      token: null
    },
      { where: { id: id } },
    );
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

module.exports = {
  findUserByEmail,
  findUserAccountByEmail,
  updateForgotPassword,
  findAccountByToken,
  resetPassword
};
