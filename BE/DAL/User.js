import { includes } from "lodash";
import db from "../models/index";
const { Op } = require("sequelize");
import { sequelize } from "../models/index";

const findOneUser = async (userId) => {
  try {
    let user = "";
    user = await db.users.findOne({
      where: { id: userId },
      include: [{ model: db.roles, attributes: ["name"] }],
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

const getAllUsersDAL = async (data) => {
  try {
    let filterData
    if (data.role) {
      // if (data.role.includes(5)) {
      //   filterData = {
      //     email: {
      //       [Op.like]: `%${data.email || ''}%`
      //     },
      //     role_id: [2, 3],
      //   }
      // } else {
      filterData = {
        email: {
          [Op.like]: `%${data.email || ''}%`
        },
        role_id: data.role,
      }
      // }
    } else {
      filterData = {
        email: {
          [Op.like]: `%${data.email || ''}%`
        }
      }
    }
    let users = await db.users.findAll({
      attributes: [
        "id",
        "name",
        "phone",
        "email",
        "gender",
        "role_id",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM users_courses WHERE user_id = users.id)"
          ),
          "courseCount",
        ],
      ],
      order: [["id", "ASC"]],
      include: [{ model: db.accounts, attributes: ["status"] },
      { model: db.roles, attributes: ["name"] }],
      where: filterData,
    });
    return {
      message: "Get all users successfully",
      users,
    };
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const getUserWithPaginationDAL = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;

    const { count, rows } = await db.users.findAndCountAll({
      attributes: [
        "id",
        "name",
        "phone",
        "email",
        "gender",
        "role_id",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM users_courses WHERE user_id = users.id)"
          ),
          "courseCount",
        ],
      ],
      order: [["id", "ASC"]],
      include: [{ model: db.accounts, attributes: ["status"] }],
      offset: offset,
      limit: limit,
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalUsers: count,
      totalPages: totalPages,
      users: rows,
    };

    return {
      message: "Get all users successfully",
      data,
    };
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const createNewUserDAL = async (data) => {
  try {
    const user = await db.users.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      role_id: data.role,
      gender: data.gender,
      address: data.address,
      birthday: data.birthday,
      start_working_time: data.start_working_time,
      end_working_time: data.end_working_time,
      grant: data.grant,
      manager: data.manager,
      hired_date: data.hired_date,
    });
    await db.accounts.create({
      user_id: user.id,
      password: data.password,
      status: "Active",
    });
    return {
      message: "Create new user successfully!",
      code: 1,
    };
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const testJson = async (data) => {
  try {
    await db.user_details.create({
      user_id: data.id,
      basic_information: { "birthday": data.birthday, "gender": data.gender },
      identify_information: data.identify_information,
      education_information: data.education_information,
      other_information: data.other_information,
    });
    return {
      message: "Create new user successfully!",
      code: 1,
    };
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const updateUserDAL = async (data) => {
  try {
    await db.users.update(
      {
        email: data.email,
        name: data.name,
        phone: data.phone,
        role_id: data.role_id,
        gender: data.gender,
        address: data.address,
        birthday: data.birthday,
        start_working_time: data.start_working_time,
        end_working_time: data.end_working_time,
        grant: data.grant,
        manager: data.manager,
        hired_date: data.hired_date,
      },
      {
        where: { id: data.id }
      }
    );
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const changePasswordDAL = async (userId, password) => {
  try {
    await db.accounts.update({
      password: password,
    },
      {
        where: { user_id: userId }
      }
    );
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const changeStatusAccountDAL = async (data, status) => {
  try {
    await db.accounts.update({
      status: status
    },
      {
        where: { user_id: data.id }
      }
    )
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const findAccountByUserId = async (id) => {
  try {
    let account = await db.accounts.findOne({
      where: { user_id: id },
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

module.exports = {
  findOneUser,
  getAllUsersDAL,
  getUserWithPaginationDAL,
  createNewUserDAL,
  updateUserDAL,
  changePasswordDAL,
  changeStatusAccountDAL,
  findAccountByUserId,
  testJson
};
