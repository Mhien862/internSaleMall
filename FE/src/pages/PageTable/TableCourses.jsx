import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  PaginationItem,
  TablePagination,
  Avatar,
} from "@mui/material";
import "./PageTable.scss";
import { img } from "../../utils";
import { Tag } from "antd";

import { getDataCourses, getStatusTable } from "../../stores/slices/Table";
import {
  setCoursesId,
  setCoursesData,
  getStatus,
} from "../../stores/slices/Courses";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  handleGetUserCourses,
  handleGetAssignUser,
  handleGetCourses,
} from "../../services";
import moment from "moment/dist/moment";
import EditCourse from "../Modal/CourseManagement/EditCourse";
import { getError } from "../../stores/slices/authSlice";
import LoadingTable from "../Loading/LoadingTable";
import { useNavigate } from "react-router-dom";

const TableCourses = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const statusTable = useSelector(getStatusTable);
  const errorCourse = useSelector(getError);
  const navigate = useNavigate();

  const data = useSelector(getDataCourses);
  const dispatch = useDispatch();

  const createData = (
    id,
    name,
    progress,
    training_form,
    manager,
    manager_avatar,
    manager_color,
    create_by,
    create_by_avatar,
    create_by_color,
    from_date,
    summary,
    to_date,
    mentorCount,
    studentCount,
    status
  ) => {
    return {
      id,
      name,
      progress,
      training_form,
      manager,
      manager_avatar,
      manager_color,
      create_by,
      create_by_avatar,
      create_by_color,
      from_date,
      summary,
      to_date,
      mentorCount,
      studentCount,
      status,
    };
  };
  const rows = [];
  if (data && data.length > 0) {
    data.map((item) => {
      let progress = item.progress;
      if (item.lessons) {
        progress = Math.ceil((item.progress / item.lessons) * 100);
      }
      return rows.push(
        createData(
          item.id,
          item.name,
          progress,
          item.training_form,
          item.courses_manager.name,
          item.courses_manager.avatar,
          item.courses_manager.avatar ? "" : "red",
          item.courses_create_by.name,
          item.courses_create_by.avatar,
          item.courses_create_by.avatar ? "" : "red",
          item.from_date,
          item.to_date,
          item.mentorCount,
          item.studentCount,
          item.status.toUpperCase()
        )
      );
    });
  }

  const emptyRows =
    page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const count = rows ? Math.ceil(rows.length / rowsPerPage) : 1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openAssignMentor, setOpenAssignMentor] = useState(false);
  const handleOpenAssignMentor = (id) => {
    dispatch(handleGetUserCourses({ course_id: id, position: "Mentor" }));
    dispatch(handleGetAssignUser(`role=2&role=3`));
    dispatch(setCoursesId(id));
    setOpenAssignMentor(true);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = async (id) => {
    try {
      setOpenEdit(true);
      await dispatch(handleGetCourses({ course_id: id })).unwrap();
      dispatch(handleGetAssignUser(`role=2&role=3&role=4`));
    } catch (e) {
      setOpenEdit(false);
      toast.error(errorCourse, {
        className: "toast-message",
      });
    }
  };

  const handleView = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <>
      <EditCourse
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        handleOpen={() => setOpenEdit(true)}
      ></EditCourse>
      <div className="table-container">
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="head-item">ID</TableCell>
              <TableCell className="head-item">Courses Name</TableCell>
              <TableCell className="head-item">Image</TableCell>
              <TableCell className="head-item">Description</TableCell>
              <TableCell className="head-item">From Date</TableCell>
              <TableCell className="head-item">To Date</TableCell>
              <TableCell className="head-item" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {statusTable.includes("loading") ? (
            <LoadingTable row={5} cell={12}></LoadingTable>
          ) : (
            <TableBody className="table-body">
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => (
                <TableRow key={row.id} style={{ height: 40 }}>
                  <TableCell className="body-item">{row.id}</TableCell>
                  <TableCell className="body-item">{row.name}</TableCell>
                  <TableCell className="body-item">{row.name}</TableCell>
                  <TableCell className="body-item">{row.summary}</TableCell>
                  <TableCell className="body-item">
                    {row.from_date
                      ? moment(row.from_date).format("DD/MM/YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell className="body-item">
                    {row.to_date
                      ? moment(row.to_date).format("DD/MM/YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell className="body-item actions" align="center">
                    <div className="actions-img">
                      <img src={img.MORE} alt="actions" />
                    </div>
                    <div className="dropdown-actions">
                      <div
                        className="view in-row"
                        onClick={() => handleView(row.id)}
                      >
                        <img src={img.DROPDOWN_6} alt="dropdown" />
                        <span>View</span>
                      </div>

                      <div
                        className="edit in-row"
                        onClick={() => handleOpenEdit(row.id)}
                      >
                        <img src={img.DROPDOWN_4} alt="dropdown" />
                        <span>Edit</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 40 * emptyRows,
                  }}
                >
                  <TableCell className="empty-row" colSpan={12} />
                </TableRow>
              )}
              <TableRow>
                <TableCell className="table-footer" colSpan={12}></TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <div className="table-pagination in-row">
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ style: { display: "none" } }}
            backIconButtonProps={{ style: { display: "none" } }}
          />
          <Pagination
            count={count}
            shape="rounded"
            className="pagination"
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
            renderItem={(item) => <PaginationItem {...item} />}
          />
        </div>
      </div>
    </>
  );
};

export default TableCourses;
