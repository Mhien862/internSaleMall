import { useEffect, useState } from "react";
import "./UserManagement.scss";
import { img } from "../../utils";
import { FormInput } from "../../components";
import PageTable from "../PageTable/PageTable";
import NewAccount from "../Modal/UserManagement/NewAccount";
import { handleGetAllUser } from "../../services/User";
import { toast } from "react-toastify";
import { getStatusTable, getError } from "../../stores/slices/Table";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { css, path } from "../../utils";
import { DropdownIndicator } from "../../components";

const UserManagement = () => {
  const search = FormInput("");
  const [role, setRole] = useState("");
  const { pathname } = useLocation()

  const onClearFilter = () => {
    search.onChange("");
    setRole("");
  };

  const listRole = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Monitoring" },
    { value: "3", label: "Trainer" },
    { value: "4", label: "Student" },
  ];

  const status = useSelector(getStatusTable);
  const error = useSelector(getError);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (pathname.includes(path.USER_MANAGEMENT)) {
      dispatch(handleGetAllUser({ email: search.value, role: role.value || "" }));
    }
  }, [search.value, role, pathname]);

  useEffect(() => {
    if (status === "failed") {
      toast.error(error, {
        className: "toast-message",
      });
    }
  }, [status]);

  return (
    <div className="user-management-container">
      <div className="user-management-content">
        <NewAccount open={open} handleClose={handleClose}></NewAccount>
        <div className="header">
          <div className="main-content in-row">
            <div className="title">
              <span>Account management</span>
            </div>
            <div className="actions">
              <button className="add-new btn" onClick={handleOpen}>
                New Account
              </button>
            </div>
          </div>
          <div className="filter-bar in-row" id="create-course-form">
            <div className="search in-row">
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search Account"
                {...search}
              />
              <div className="icon-input search-icon">
                <img src={img.SEARCH} alt="search" />
              </div>
            </div>
            <div className="role-box in-row">
              <Select
                options={listRole}
                className="select-form"
                components={{ DropdownIndicator }}
                placeholder="Choose Role"
                value={role}
                onChange={(value) => setRole(value)}
                styles={css.cssSelectFilter}
              />
            </div>
            <div className="clear-filter">
              <button className="btn" onClick={onClearFilter}>
                Clear Filter
              </button>
            </div>
          </div>
        </div>
        <div className="body">
          <PageTable></PageTable>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;