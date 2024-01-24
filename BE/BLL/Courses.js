import coursesDAL from "../DAL/Courses"
import differenceWith from 'lodash/differenceWith'
import lessons from "../models/lessons";

const getCourses = async (data) => {
  try {
    let coursesId = data.query.id
    if (!coursesId) {
      throw {
        code: 406,
        message: `Missing your parameter`
      }
    }

    let courses = await coursesDAL.findOneCourses(data.query)
    let schedule = await coursesDAL.getSchedule({ course_id: coursesId, detail: data.query.detail })
    if (!courses) {
      throw {
        code: 400,
        message: `Your's courses isn't exist`
      }
    }

    return { courses, schedule }
  } catch (e) {
    console.log(e)
    if (e.code) {
      throw e
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const createNewCourses = async (data) => {
  try {
    let name = data.name_courses;
    let training_form = data.training_form;
    let manager = data.manager;
    let summary = data.summary;
    if (!name || !training_form || !manager || !summary) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    const courses = await coursesDAL.createCourses(data)
    await createTechnology(data, courses.id)
    await createUserCourses(data, courses.id)
    await createCategories(data, courses.id)
    return {
      message: "Create new courses successfully!",
      code: 200,
    };
  } catch (e) {
    console.log(e);
    if (e.code === 422) {
      throw e
    }
    if (e.coursesId) {
      await coursesDAL.deleteCourses(e.coursesId)
    }
    throw e;
  }
};

const createTechnology = async (data, coursesId) => {
  try {
    let dataTechnology = []
    if (data.technology && data.technology.length > 0) {
      dataTechnology = data.technology.map(item => {
        return {
          course_id: coursesId,
          technology_id: item.technology_id
        }
      })
      await coursesDAL.createTechnology(dataTechnology)
    }
  } catch (error) {
    console.log(error);
    throw {
      coursesId: coursesId,
      code: 500,
      message: `Server error`
    };
  }
}

const createUserCourses = async (data, coursesId) => {
  try {
    let dataUser = []
    let listUser

    if (data.categories && data.categories.length > 0) {
      data.categories.forEach((value, index) => {
        if (index === 0 || index) {
          if (data[index] && data[index].length > 0) {
            listUser = data[index].map(item => {
              if (item.trainer) {
                return {
                  course_id: coursesId,
                  user_id: item.trainer,
                  position: "Mentor",
                  type: "Existing"
                }
              }
            })
          }
        }
        if (listUser && listUser.length > 0) {
          dataUser.push(...listUser)
        }
      })
    }

    if (data.students && data.students.length > 0) {
      listUser = data.students.map(item => {
        return {
          course_id: coursesId,
          user_id: item.user_id,
          position: "Student",
          type: "Existing"
        }
      })
      if (listUser && listUser.length > 0) {
        dataUser.push(...listUser)
      }
    }

    if (dataUser && dataUser.length > 0) {
      await coursesDAL.createUserCourses(dataUser)
    }
  } catch (error) {
    console.log(error);
    throw {
      coursesId: coursesId,
      code: 500,
      message: `Server error`
    };
  }
}

const createCategories = async (data, coursesId) => {
  try {
    console.log(data)
    let dataCategories = []
    if (data.categories && data.categories.length > 0) {
      dataCategories = data.categories.map((item, index) => {
        if (data[index] && data[index].length > 0) {
          return {
            id: item.id,
            name: item.name,
            course_id: coursesId,
          }
        }
      })
      const categories = await coursesDAL.createCategories(dataCategories)
      console.log(categories)
      await createLessons(data, categories)
    }
  } catch (error) {
    console.log(error);
    throw {
      coursesId: coursesId,
      code: 500,
      message: `Server error`
    };
  }
}

const createLessons = async (data, categories) => {
  try {
    let dataLesson = []
    let listLesson
    data.categories.forEach((value, index) => {
      if (index === 0 || index) {
        if (data[index] && data[index].length > 0) {
          listLesson = data[index].map(item => {
            return {
              id: item.id,
              category_id: categories[index].id,
              name: item.name ? item.name : null,
              date: item.date ? item.date : null,
              duration: item.duration ? item.duration : null,
              trainer: item.trainer ? item.trainer : null,
              status: item.status ? item.status : 'Pending',
              description: item.description ? item.description : null,
              document_status: item.document_status ? item.document_status : 'Pending',
            }
          })
        }
        dataLesson.push(...listLesson)
      }
    });

    if (dataLesson && dataLesson.length > 0) {
      const lessons = await coursesDAL.getLessons(categories[0].course_id)
      let toDelete = differenceWith(lessons, dataLesson, (a, b) => {
        return a.id === b.id
      })

      if (toDelete && toDelete.length > 0) {
        listLesson = toDelete.map((item) => {
          return item.id
        })
        await coursesDAL.deleteLessons(listLesson)
      }

      await coursesDAL.createLessons(dataLesson)
    }
  } catch (error) {
    console.log(error);
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const addNewUserCourses = async (data) => {
  let coursesId = data.course_id
  let dataUser = []

  try {
    if (!coursesId) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    if (data.users && data.users.length > 0) {

      const user = await coursesDAL.getAllUserCourses({
        course_id: coursesId,
        position: data.users[0].position
      })

      dataUser = data.users.map(item => {
        return {
          id: item.id,
          course_id: coursesId,
          user_id: item.user_id,
          position: item.position,
          type: "Existing"
        }
      })

      let toDelete = differenceWith(user, dataUser, (a, b) => {
        return a.user_id === b.user_id
      })

      if (toDelete && toDelete.length > 0) {
        let listUser = toDelete.map((item) => {
          return item.id
        })
        await coursesDAL.removeUserCourses(listUser)
      }

      await coursesDAL.createUserCourses(dataUser)
      return {
        message: "Add new user successfully!",
        code: 200,
      };
    }
  } catch (error) {
    if (error.code) {
      throw error
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const removeUserCourses = async (data) => {
  let userId = data.id
  try {
    if (!userId) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    await coursesDAL.removeUserCourses(data)
    return {
      message: "Remove user successfully!",
      code: 200,
    };
  } catch (error) {
    if (error.code) {
      throw error
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const getAllCourses = async (data) => {
  try {
    let response = await coursesDAL.getAllCoursesDAL(data)
    return response
  } catch (e) {
    console.log(e);
    if (e.code) {
      throw e
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const changeStatusCourses = async (data) => {
  try {
    let coursesId = data.id
    let status = data.status
    if (!coursesId || !status) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    let courses = await coursesDAL.findOneCourses(data);
    if (!courses) {
      throw {
        code: 400,
        message: `Your's course isn't exist`
      }
    }

    await coursesDAL.changeStatusCourses(data);
    return {
      message: "Update status course successfully!"
    }
  } catch (e) {
    if (e.code) {
      throw e
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const getAllUserCourses = async (data) => {
  try {
    let coursesId = data.course_id
    let position = data.position
    if (!coursesId || !position) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    let courses = await coursesDAL.getAllUserCourses(data);

    return courses
  } catch (error) {
    if (error.code) {
      throw error
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const editCourses = async (data) => {
  try {
    let coursesId = data.course_id
    let name = data.name_courses;
    let training_form = data.training_form;
    let manager = data.manager;
    let summary = data.summary;

    if (!coursesId || !name || !training_form || !manager || !summary) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    await coursesDAL.editCourses(data);
    await createTechnology(data, data.course_id);
    await addNewUserCourses(data)
    await createCategories(data, data.course_id)
    return {
      message: `Update courses successfully!`,
    };
  } catch (e) {
    console.log(e)
    if (e.code) {
      throw e
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
};

const getSchedule = async (data) => {
  try {
    let coursesId = data.course_id
    if (!coursesId) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    let schedule = await coursesDAL.getSchedule(data);

    return schedule
  } catch (error) {
    if (error.code) {
      throw error
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

const editSchedule = async (data) => {
  let coursesId = data.course_id
  try {
    if (!coursesId) {
      throw {
        message: "Missing required parameters",
        code: 422
      }
    }

    await createCategories(data, coursesId)
    return {
      message: "Update schedule successfully!",
    };
  } catch (error) {
    if (error.code) {
      throw error
    }
    throw {
      code: 500,
      message: `Server error`
    }
  }
}

module.exports = {
  createNewCourses,
  changeStatusCourses,
  addNewUserCourses,
  removeUserCourses,
  getCourses,
  getAllCourses,
  getAllUserCourses,
  editCourses,
  getSchedule,
  editSchedule
};