var express = require('express');
var router = express.Router();
import coursesControllers from "../controller/Courses"


const coursesRoute = (app) => {
    router.get("/all-courses", coursesControllers.getAllCourses);
    router.post("/create-new-courses", coursesControllers.createNewCourses);
    router.put("/change-status-courses", coursesControllers.changeStatusCourses);
    router.put("/add-new-user-courses", coursesControllers.addNewUserCourses);
    router.delete("/remove-user-courses", coursesControllers.removeUserCourses);
    router.get("/all-user-courses", coursesControllers.getAllUserCourses);
    router.get("/get-courses", coursesControllers.getCourses);
    router.put("/edit-courses", coursesControllers.editCourses);
    router.get("/get-schedule", coursesControllers.getSchedule);
    router.put("/edit-schedule", coursesControllers.editSchedule);
    return app.use("/", router)
}
module.exports = coursesRoute;