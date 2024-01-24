import db from "../models/index";
const { Op, where } = require("sequelize");
import { sequelize, Sequelize } from "../models/index";

const findOneCourses = async (data) => {
  try {
    let courses = "";
    if (data.detail) {
      courses = await db.courses.findOne({
        include: [
          {
            model: db.users_courses, raw: true,
            include: [
              { model: db.users, attributes: ['name', 'avatar'], raw: true, },
            ]
          },
        ],
        where: { id: data.id },
      })
    } else {
      courses = await db.courses.findOne({
        include: [
          { model: db.technology_courses, attributes: ['technology_id'], raw: true, },
          { model: db.users_courses, raw: true, },
        ],
        where: { id: data.id },
      })
    }
    return courses;
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const getAllCoursesDAL = async (data) => {
  try {
    let filterData
    if (data.status) {
      filterData = {
        name: {
          [Op.like]: `%${data.name || ''}%`
        },
        status: data.status,
      }
    } else {
      filterData = {
        name: {
          [Op.like]: `%${data.name || ''}%`
        }
      }
    }

    let courses = await db.courses.findAll({
      attributes: [
        "id", "name", "progress", "training_form", "manager", "create_by", "status", "from_date", "to_date", "lessons",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM users_courses WHERE position ='Student' AND course_id=courses.id )`
          ),
          "studentCount",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM users_courses WHERE position ='Mentor' AND course_id=courses.id )`
          ),
          "mentorCount",
        ],
      ],
      include: [
        { model: db.users, as: 'courses_manager', attributes: ['name', 'avatar'], raw: true, },
        { model: db.users, as: 'courses_create_by', attributes: ['name', 'avatar'], raw: true, },
      ],
      order: [["id", "ASC"]],
      where: filterData,
    });
    return {
      message: "Get all courses successfully",
      courses,
    };
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const createCourses = async (data) => {
  try {
    const courses = await db.courses.create({
      name: data.name_courses,
      training_form: data.training_form,
      manager: data.manager,
      create_by: data.manager,
      status: 'Pending',
      from_date: data.from_date,
      to_date: data.to_date,
      fee: data.fee,
      color: data.color,
      summary: data.summary,
      training_location: data.training_location,
      progress: 0,
      lessons: data.lessons
    });
    return courses
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const createTechnology = async (data) => {
  try {
    await db.technology_courses.destroy({
      where: { course_id: data[0].course_id }
    })
    await db.technology_courses.bulkCreate(data)
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const createUserCourses = async (data) => {
  try {
    await db.users_courses.bulkCreate(data, {
      updateOnDuplicate: ["course_id", "user_id", "position", "type"],
    })
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const createCategories = async (data) => {
  console.log(data)
  try {
    const categories = await db.categories.bulkCreate(data, {
      updateOnDuplicate: ["course_id", "name"],
    })
    return categories
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const createLessons = async (data) => {
  try {
    console.log(data)
    await db.lessons.bulkCreate(data, {
      updateOnDuplicate: ["category_id", "name", "date", "duration", "trainer", "status"]
    })
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const deleteCourses = async (coursesId) => {
  try {
    await db.categories.destroy({
      where: { course_id: coursesId }
    });
    await db.technology_courses.destroy({
      where: { course_id: coursesId }
    });
    await db.users_courses.destroy({
      where: { course_id: coursesId }
    });
    await db.courses.destroy({
      where: { id: coursesId }
    });
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const removeUserCourses = async (data) => {
  try {
    await db.users_courses.destroy({
      where: {
        id: data,
      }
    });
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const changeStatusCourses = async (data) => {
  try {
    await db.courses.update({
      status: data.status
    },
      {
        where: { id: data.id }
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

const getAllUserCourses = async (data) => {
  try {
    let filter = { course_id: data.course_id }
    if (data.position) {
      filter = {
        course_id: data.course_id,
        position: data.position
      }
    }
    const users = await db.users_courses.findAll({
      include: [
        {
          model: db.users, raw: true,
          include: [
            { model: db.roles, raw: true, },
          ]
        },
      ],
      where: filter
    })
    return users
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const editCourses = async (data) => {
  try {
    const courses = await db.courses.update({
      name: data.name_courses,
      training_form: data.training_form,
      manager: data.manager,
      from_date: data.from_date,
      to_date: data.to_date,
      fee: data.fee,
      color: data.color,
      summary: data.summary,
      training_location: data.training_location,
      lessons: data.lessons
    },
      {
        where: { id: data.course_id }
      }
    );
    return courses
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const getSchedule = async (data) => {
  try {
    let schedule
    if (data.detail) {
      schedule = await db.categories.findAll({
        include: [
          {
            model: db.lessons, raw: true,
            include: [
              { model: db.users, attributes: ['name', 'avatar'], raw: true, },
            ]
          },
        ],
        where: {
          course_id: data.course_id,
        },
        order: [["id", "ASC"]],
      })
    } else {
      schedule = await db.categories.findAll({
        include: [
          {
            model: db.lessons, raw: true,
          },
        ],
        where: {
          course_id: data.course_id,
        }
      })
    }
    return schedule
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const getLessons = async (data) => {
  try {
    const schedule = await db.lessons.findAll({
      attributes: ["id"],
      include: [{
        model: db.categories,
        attributes: [],
        where: {
          course_id: data,
        }
      }],
      raw: true,
    })
    return schedule
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const deleteLessons = async (data) => {
  try {
    await db.lessons.destroy({
      where: {
        id: data,
      }
    });
  } catch (e) {
    console.log(e);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

module.exports = {
  findOneCourses,
  changeStatusCourses,
  createTechnology,
  createCategories,
  createUserCourses,
  createLessons,
  deleteCourses,
  removeUserCourses,
  getAllCoursesDAL,
  createCourses,
  getAllUserCourses,
  editCourses,
  getSchedule,
  getLessons,
  deleteLessons,
};