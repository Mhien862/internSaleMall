import { useState } from "react";
import "./Nav.scss";
import { img } from "../../utils";
import NavSecondary from "../Nav/NavSecondary";
import { FaCircleUser } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { handleLogoutApi } from "../../services/Auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, getUser } from "../../stores/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { path } from "../../utils";
import { Avatar } from "@mui/material";

const Nav = (props) => {
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      let res = await handleLogoutApi();
      let data = res.data;
      if (res && (res.status === 200 || res.status === 204)) {
        dispatch(logout());
        navigate(path.LOGIN);
        toast.success(data.message, {
          className: "toast-message",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error, {
        className: "toast-message",
      });
    }
  };
  return (
    <div className="nav-container">
      <div className="nav-background">
        <div className="nav-left">
          <div className="left-content in-row">
            <div className="menu" onClick={() => props.setShow(!props.show)}>
              <img src={img.MENU} alt="nav-menu" />
            </div>
            <div className="logo">
              <h3>Tran Hien</h3>
            </div>
          </div>
        </div>
        <div className="nav-right">
          <div className="right-content in-row">
            <div className="option in-row">
              <div className="option-item">
                <img src={img.NOTIFICATION} alt="option-item" />
              </div>
              <div className="option-item">
                <img src={img.QUESTION} alt="option-item" />
              </div>
              <div className="option-item">
                <img src={img.SETTINGS} alt="option-item" />
              </div>
            </div>
            <div className="user">
              <div className="avatar">
                <Avatar
                  src={user.avatar}
                  sx={{
                    bgcolor: user.avatar ? "" : "red",
                    width: "25px",
                    height: "25px",
                    fontSize: "14px",
                  }}
                ></Avatar>
              </div>
              <div className="dropdown-user">
                <div className="title-dropdown dropdown-show">
                  <p>Admin</p>
                </div>
                <div className="content-dropdown">
                  <span className="profile">
                    <i>
                      <FaCircleUser></FaCircleUser>
                    </i>
                    <span>Profile</span>
                  </span>
                  <span className="logout" onClick={handleLogout}>
                    <i>
                      <FaSignOutAlt></FaSignOutAlt>
                    </i>
                    <span className="title">Logout</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-bottom"></div>
      <NavSecondary show={props.show}></NavSecondary>
    </div>
  );
};

export default Nav;
