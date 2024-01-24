var express = require('express');
var router = express.Router();
import AuthController from "../controller/Auth"
import verifyJWT from '../middleware/authenticator'

const authRoute = (app) => {
    router.post("/login", AuthController.handleLogin);
    router.post("/logout", AuthController.handleLogout);
    router.get("/refreshToken", AuthController.refreshToken);
    router.post("/forgot-password", AuthController.forgotPassword);
    router.post("/reset-password", AuthController.resetPassword);
    router.get("/account", verifyJWT, AuthController.getAccount)
    return app.use("/Auth", router)
}

module.exports = authRoute;