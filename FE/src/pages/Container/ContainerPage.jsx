import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, Navigate } from "react-router-dom";
import Nav from "../Nav/Nav";

import { useSelector, useDispatch } from "react-redux";
import { isLogin, getStatus } from "../../stores/slices/authSlice";
import { handleGetUserAccount } from "../../services";
import { Backdrop, CircularProgress } from "@mui/material";
import { getOpen } from "../../stores/slices/Loading";

const ContainerPage = () => {
  const [showSecondary, setShowSecondary] = useState(true);
  const isLoggedIn = useSelector(isLogin);
  const status = useSelector(getStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const open = useSelector(getOpen);
  const [isHide, setIsHide] = useState(true);

  setTimeout(() => setIsHide(false), 1000);

  const getAccount = async () => {
    try {
      dispatch(handleGetUserAccount(dispatch));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      getAccount();
    }
  }, [isLoggedIn]);

  return (
    <div className="container">
      {isLoggedIn ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 500 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      {status !== "loading" && !isHide ? (
        <>
          <Nav show={showSecondary} setShow={setShowSecondary}></Nav>
          <div
            className={
              showSecondary ? "page-container" : "page-container full-page"
            }
          >
            <Outlet></Outlet>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ContainerPage;
