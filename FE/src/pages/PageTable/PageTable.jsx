import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableRow,
  Pagination,
  PaginationItem,
  TablePagination,
  TableContainer,
  Skeleton,
} from "@mui/material";
import "./PageTable.scss";
import { img } from "../../utils";
import EditAccount from "../Modal/UserManagement/EditAccount";
import ChangePassword from "../Modal/UserManagement/ChangePassword";
import ActiveAccount from "../Modal/UserManagement/ActiveAccount";
import {
  getData,
  getStatus,
  getError,
  setData,
  setUserData,
} from "../../stores/slices/User";
import { getDataUser, getStatusTable } from "../../stores/slices/Table";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleGetUserInformation } from "../../services";
import LoadingTable from "../Loading/LoadingTable";

const PageTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [edit, setEdit] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [active, setActive] = useState(false);

  const status = useSelector(getStatus);
  const error = useSelector(getError);
  const data = useSelector(getDataUser);
  const statusTable = useSelector(getStatusTable)
  const dispatch = useDispatch();

  const handleEdit = (userId) => {
    dispatch(handleGetUserInformation(userId));
    setEdit(true);
  };
  const handleActive = (userId) => {
    const result = data.filter((item) => item.id === userId);
    dispatch(setUserData(result[0]));
    setActive(true);
  };

  const handleChangePass = (userId) => {
    dispatch(setData({ name: "id", value: userId }));
    setChangePass(true);
  };

  const handleClose = () => {
    setEdit(false);
    setChangePass(false);
    setActive(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (status === "failed") {
      setEdit(false);
      toast.error(error, {
        className: "toast-message",
      });
    }
  }, [status]);

  useEffect(() => {
    setPage(0)
  }, [statusTable]);

  const createData = (
    id,
    fullName,
    phone,
    email,
    role,
    gender,
    status,
    actions
  ) => {
    return {
      id,
      fullName,
      phone,
      email,
      role,
      gender,
      status,
      actions,
    };
  };
  const rows = [];
  if (data && data.length > 0) {
    data.map((item) => {
      return rows.push(
        createData(
          item.id,
          item.name,
          item.phone,
          item.email,
          item.role.name,
          item.gender,
          item.account.status
        )
      );
    });
  }

  const emptyRows =
    page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const count = rows ? Math.ceil(rows.length / rowsPerPage) : 1;
  return (
    <div className="table-container">
      <EditAccount open={edit} handleClose={handleClose}></EditAccount>
      <ChangePassword
        open={changePass}
        handleClose={handleClose}
      ></ChangePassword>
      <ActiveAccount open={active} handleClose={handleClose}></ActiveAccount>
      <div className="table-content">
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell className="head-item">ID</TableCell>
              <TableCell className="head-item">Full Name</TableCell>
              <TableCell className="head-item">Phone</TableCell>
              <TableCell className="head-item">Email</TableCell>
              <TableCell className="head-item">Role</TableCell>
              <TableCell className="head-item">Gender</TableCell>
              <TableCell className="head-item">Status</TableCell>
              <TableCell className="head-item" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {statusTable.includes("loading") ?
            <LoadingTable row={5} cell={8}></LoadingTable>
            :
            <>
              <TableBody className="table-body">
                {(rowsPerPage > 0
                  ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : rows
                ).map((row) => (
                  <TableRow key={row.id} style={{ height: 40 }}>
                    <TableCell className="body-item">{row.id}</TableCell>
                    <TableCell className="body-item">{row.fullName || "-"}</TableCell>
                    <TableCell className="body-item">{row.phone}</TableCell>
                    <TableCell className="body-item">{row.email}</TableCell>
                    <TableCell className="body-item">{row.role}</TableCell>
                    <TableCell className="body-item">{row.gender || "-"}</TableCell>
                    <TableCell
                      className="body-item"
                      style={
                        row.status.includes("Inactive")
                          ? { color: "red" }
                          : { color: "#00D084" }
                      }
                    >
                      {row.status}
                    </TableCell>
                    <TableCell className="body-item actions" align="center">
                      <div className="actions-img">
                        <img src={img.MORE} alt="actions" />
                      </div>
                      <div className="dropdown">
                        <div className="dropdown-actions">
                          <div
                            className="edit in-row"
                            onClick={() => handleEdit(row.id)}
                          >
                            <img src={img.DROPDOWN_1} alt="dropdown" />
                            <span>Edit</span>
                          </div>
                          <div
                            className="change-password in-row"
                            onClick={() => handleChangePass(row.id)}
                          >
                            <img src={img.DROPDOWN_2} alt="dropdown" />
                            <span>Change password</span>
                          </div>
                          <div
                            className="deactivate in-row"
                            onClick={() => handleActive(row.id)}
                          >
                            <img src={img.DROPDOWN_3} alt="dropdown" />
                            <span>{row.status.includes("Inactive") ? "Activate" : "Deactivate"}</span>
                          </div>
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
                    <TableCell className="empty-row" colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="table-footer" colSpan={8}></TableCell>
                </TableRow>
              </TableFooter>
            </>
          }
        </Table>
      </div>
      <div className="table-pagination in-row">
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50, 100, { label: "All", value: -1 }]}
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
  );
};

export default PageTable;