import userBLLs from "../BLL/User";

const createNewUser = async (req, res) => {
  let response = await userBLLs.createNewUserBLL(req.body);
  if (response.code === 0) {
    return res.status(403).send(response.message)
  }
  if (response.code === 1) {
    return res.status(200).send(response.message)
  }
  if (response.code === 2) {
    return res.status(422).send(response.message)
  }
};

const testJson = async (req, res) => {
  let response = await userBLLs.testJson(req.body);
  if (response.code === 0) {
    return res.status(403).send(response.message)
  }
  if (response.code === 1) {
    return res.status(200).send(response.message)
  }
  if (response.code === 2) {
    return res.status(422).send(response.message)
  }
};

const updateUser = async (req, res) => {
  try {
    let response = await userBLLs.updateUserBLL(req.body);
    return res.status(200).send(response)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const getUser = async (req, res) => {
  try {
    let data = await userBLLs.getUser(req)
    return res.status(200).json({
      user: data ? data : {}
    })
  } catch (error) {
    return res.status(error.code).json({
      message: error.message,
    })
  }
}

const getAllUsers = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let response = await userBLLs.getUserWithPaginationBLL(+page, +limit);
      return res.status(200).json({
        message: response.message,
        data: response.data,
      });
    } else {
      let data = await userBLLs.getAllUsersBLL(req.query);
      return res.status(200).json({
        message: data.message,
        users: data.users,
      });
    }
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const getAllAssign = async (req, res) => {
  try {
    let data = await userBLLs.getAllAssignBLL(req.query);
    return res.status(200).json({
      data
    });
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const changePassword = async (req, res) => {
  try {
    let response = await userBLLs.changePasswordBLL(req.body);
    return res.status(200).send(response)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const changeStatusAccount = async (req, res) => {
  try {
    let response = await userBLLs.changeStatusAccountBLL(req.body);
    return res.status(200).send(response)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

module.exports = {
  createNewUser,
  updateUser,
  getUser,
  getAllUsers,
  changePassword,
  changeStatusAccount,
  testJson,
  getAllAssign
};
