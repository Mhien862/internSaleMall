import { useState, useEffect } from "react";
import "./NavSecondary.scss";
import { img, path } from "../../utils";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../../stores/slices/authSlice";

const NavSecondary = (props) => {
  const [select, setSelect] = useState(0);
  const user = useSelector(getUser);
  const { pathname } = useLocation();

  useEffect(() => {
    checkPath();
  }, [pathname]);

  const checkPath = () => {
    if (pathname.includes("application") || pathname.includes("accounts")) {
      setSelect(3);
    } else if (pathname.includes("courses")) {
      setSelect(1);
    }
  };

  const ShowItems = (show) => {
    if (show) {
      return "nav-items show-items";
    } else {
      return "nav-items";
    }
  };

  const SelectItem = (selectItem) => {
    if (selectItem) {
      return "nav-item active";
    } else {
      return "nav-item";
    }
  };

  const setSelectItem = (selectNum) => {
    if (select !== selectNum) {
      setSelect(selectNum);
    } else {
      setSelect(0);
    }
  };

  return (
    <div
      className={
        props.show
          ? "nav-secondary-container"
          : "nav-secondary-container hide-nav"
      }
    >
      <div className="nav-secondary-background">
        <div className="nav-header in-row">
          <div className="img">
            <img src={img.NAV_HEADER} alt="nav-header" />
          </div>
          <div className="content">
            <p className="name">SALEMALL</p>
            <span className="type">Product Management</span>
          </div>
        </div>
        <div className="nav-body">
          <div className="nav-sidebar">
            <div
              className={SelectItem(select === 1)}
              onClick={() => setSelectItem(1)}
            >
              <img src={img.NAV_ICON_1} alt="nav-icon" />
              <span>Products</span>
            </div>
            <div className={ShowItems(select === 1)}>
              <NavLink to={path.USER_COURSES} className="nav-item">
                <img src={img.ALL_COURSES} alt="nav-icon" />
                <span>All Products</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-secondary-background-right">
        <div className="light-background"></div>
      </div>
    </div>
  );
};
export default NavSecondary;
