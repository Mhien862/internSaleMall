import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import Forgot from "../pages/Forgot/Forgot";
import SetNewPass from "../pages/SetNewPass/SetNewPass";
import ContainerAuth from "../pages/Container/ContainerAuth";
import SignUp from "../pages/SignUp/SignUp";
import { path } from "../utils";

const Auth = () => {
  return (
    <Routes>
      <Route element={<ContainerAuth />}>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FORGOT} element={<Forgot />} />
        <Route path={path.RESET_PASSWORD} element={<SetNewPass></SetNewPass>} />
        <Route path={path.SIGNUP} element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default Auth;
