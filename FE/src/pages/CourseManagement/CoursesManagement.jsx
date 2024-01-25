import { useEffect, useState } from "react";
import "./CoursesManagement.scss";
import { img } from "../../utils";
import { FormInput } from "../../components";
import TableCourses from "../PageTable/TableCourses";
import { handleGetAllCourses, handleGetAssignUser } from "../../services";
import NewCourse from "../Modal/CourseManagement/NewCourse.jsx";
import EditCourse from "../Modal/CourseManagement/EditCourse.jsx";
import { toast } from "react-toastify";
import { getStatusTable, getError } from "../../stores/slices/Table";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { css, path } from "../../utils";
import { DropdownIndicator } from "../../components";

const CoursesManagement = () => {
  const search = FormInput("");
  const [status, setStatus] = useState("");
  const { pathname } = useLocation();

  const status_table = useSelector(getStatusTable);
  const error = useSelector(getError);
  const dispatch = useDispatch();

  const onClearFilter = () => {
    search.onChange("");
    setStatus("");
  };

  const listStatus = [
    { value: "Progress", label: "IN PROGRESS" },
    { value: "Pending", label: "PENDING" },
    { value: "Done", label: "DONE" },
    { value: "Canceled", label: "CANCELED" },
  ];

  const [openCreate, setOpenCreate] = useState(false);
  const handleOpenCreate = () => {
    dispatch(handleGetAssignUser(`role=2&role=3&role=4`));
    setOpenCreate(true);
  };

  useEffect(() => {
    if (pathname.includes(path.USER_COURSES)) {
      dispatch(
        handleGetAllCourses({ name: search.value, status: status.value || "" })
      );
    }
  }, [search.value, status, pathname]);

  useEffect(() => {
    if (status_table === "failed") {
      toast.error(error, {
        className: "toast-message",
      });
    }
  }, [status_table]);
  return (
    <div className="courses-management-container">
      <div className="courses-management-content">
        <NewCourse
          open={openCreate}
          handleClose={() => setOpenCreate(false)}
          handleOpen={() => setOpenCreate(true)}
        ></NewCourse>
        <div className="header">
          <div className="main-content in-row">
            <div className="title">
              <span>Product management</span>
            </div>
            <div className="actions">
              <button className="add-new btn" onClick={handleOpenCreate}>
                New Product
              </button>
            </div>
          </div>
          <div className="filter-bar in-row" id="create-course-form">
            <div className="search in-row">
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search Product"
                {...search}
              />
              <div className="icon-input search-icon">
                <img src={img.SEARCH} alt="search" />
              </div>
            </div>

            <div className="clear-filter">
              <button className="btn" onClick={onClearFilter}>
                Clear Filter
              </button>
            </div>
          </div>
        </div>
        <div className="body">
          <TableCourses></TableCourses>
        </div>
      </div>
    </div>
  );
};

export default CoursesManagement;
