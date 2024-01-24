
import coursesBLLs from "../BLL/Courses";

const createNewCourses = async (req, res) => {
  try {
    let response = await coursesBLLs.createNewCourses(req.body);
    return res.status(response.code).send(response.message)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const addNewUserCourses = async (req, res) => {
  try {
    let response = await coursesBLLs.addNewUserCourses(req.body);
    return res.status(response.code).send(response.message)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const removeUserCourses = async (req, res) => {
  try {
    let response = await coursesBLLs.removeUserCourses(req.query);
    return res.status(response.code).send(response.message)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const getCourses = async (req, res) => {
  try {
    let data = await coursesBLLs.getCourses(req)
    return res.status(200).json({
      data: data ? data : {}
    })
  } catch (error) {
    return res.status(error.code).json({
      message: error.message,
    })
  }
}

const getAllCourses = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let response = await coursesBLLs.getCoursesWithPagination(+page, +limit);
      return res.status(200).json({
        message: response.message,
        data: response.data,
      });
    } else {
      let data = await coursesBLLs.getAllCourses(req.query);
      return res.status(200).json({
        message: data.message,
        courses: data.courses,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const changeStatusCourses = async (req, res) => {
  try {
    let response = await coursesBLLs.changeStatusCourses(req.body);
    return res.status(200).send(response.message)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const getAllUserCourses = async (req, res) => {
  try {
    let response = await coursesBLLs.getAllUserCourses(req.query);
    return res.status(200).json({
      users: response ? response : {}
    })
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const editCourses = async (req, res) => {
  try {
    let response = await coursesBLLs.editCourses(req.body);
    return res.status(200).send(response.message)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const getSchedule = async (req, res) => {
  try {
    let response = await coursesBLLs.getSchedule(req.query);
    return res.status(200).json({
      schedule: response ? response : {}
    })
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

const editSchedule = async (req, res) => {
  try {
    let response = await coursesBLLs.editSchedule(req.body);
    return res.status(200).send(response.message)
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
};

module.exports = {
  createNewCourses,
  addNewUserCourses,
  removeUserCourses,
  getCourses,
  getAllCourses,
  changeStatusCourses,
  getAllUserCourses,
  editCourses,
  getSchedule,
  editSchedule
};
