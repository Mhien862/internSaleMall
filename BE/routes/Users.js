var express = require('express');
var router = express.Router();
import userControllers from "../controller/User"
import verifyJWT from '../middleware/authenticator'

const userRoute = (app) => {
    router.get("/all-users", userControllers.getAllUsers);
    router.get("/user-information", userControllers.getUser);
    router.post("/create-new-user", userControllers.createNewUser);
    router.post("/testJson", userControllers.testJson);
    router.put("/edit-user", userControllers.updateUser);
    router.put("/change-password", userControllers.changePassword);
    router.put("/change-status-account", userControllers.changeStatusAccount);
    router.get("/all-assign", userControllers.getAllAssign);
    return app.use("/", router)
}
module.exports = userRoute;