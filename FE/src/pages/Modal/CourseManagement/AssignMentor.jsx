import { Modal, Box } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Select from "react-select";
import { css } from "../../../utils";
import "./AssignMentor.scss";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataUsers, getStatus, removeUsers, addUsers, getCoursesId, getError, getMessage } from "../../../stores/slices/Courses";
import { setOpen } from "../../../stores/slices/Loading";
import { handleAddUserCourses, handleGetAllCourses, handleGetUserCourses } from "../../../services";
import { getUsersData } from "../../../stores/slices/User";
import { toast } from "react-toastify";
import differenceWith from 'lodash/differenceWith'
import { SearchIndicator as DropdownIndicator } from "../../../components";

function AssignMentor(props) {
  const dispatch = useDispatch()
  const data = useSelector(getDataUsers)
  const status = useSelector(getStatus)
  const listMentor = useSelector(getUsersData)
  const course_id = useSelector(getCoursesId)
  const error = useSelector(getError)
  const message = useSelector(getMessage)

  const createData = (
    id,
    fullName,
    email,
    role,
    type
  ) => {
    return {
      id,
      fullName,
      email,
      role,
      type
    };
  };
  const rows = [];
  if (data && data.length > 0) {
    data.map((item) => {
      return rows.push(
        createData(
          item.id,
          item.user.name,
          item.user.email,
          item.user.role.name,
          item.type
        )
      );
    });
  }

  const initMentorUnassigned = [];
  if (listMentor && listMentor.length > 0) {
    listMentor.map((item, index) => {
      return initMentorUnassigned.push(
        {
          value: index,
          user_id: item.id,
          position: "Mentor",
          label: item.name,
          user: item,
          type: "New",
        }
      );
    });
  }

  let listMentorUnassigned = differenceWith(initMentorUnassigned, data, (a, b) => {
    return a.user.id === b.user.id
  })

  const handleRemoveMentor = (index) => {
    dispatch(removeUsers(index))
  };

  const handleAddMentor = async () => {
    try {
      dispatch(setOpen(true))
      await dispatch(handleAddUserCourses({ course_id: course_id, users: data })).unwrap()
      dispatch(setOpen(false))
      dispatch(handleGetAllCourses({ name: "", status: "" }));
      props.handleClose()
      toast.success(message, {
        className: "toast-message",
      });
    } catch (err) {
      dispatch(setOpen(false))
      toast.error(error, {
        className: "toast-message",
      });
    }
  };

  const handleSelectMentor = (value) => {
    dispatch(addUsers(value))
  };

  const handleDiscard = () => {
    dispatch(handleGetUserCourses({ course_id: course_id, position: 'Mentor' }))
    props.handleClose()
  };

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        className="modal-course"
      >
        <Box className="modal-content" style={{ width: "600px" }}>
          <div className="container">
            <div className="title">
              <p>Assign Mentor</p>
            </div>

            <div className="form-group">
              <div className="title-select">
                <p>Find and add some candidates to this request</p>
              </div>
              <Select
                options={listMentorUnassigned}
                value=""
                onChange={(value) => handleSelectMentor(value)}
                className="select-form mt-1"
                components={{ DropdownIndicator }}
                placeholder="Select a mentor"
                styles={css.cssSelect}
              />
            </div>

            <div className="table-container mt-1">
              <label>Selected Mentor</label>
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="head-item">Trainer</TableCell>
                    <TableCell className="head-item">Email</TableCell>
                    <TableCell className="head-item">Role</TableCell>
                    <TableCell className="head-item">Type</TableCell>
                    <TableCell className="head-item">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="table-body">
                  {rows.map((mentor, index) => (
                    <TableRow style={{ height: 40 }} key={`trainer-${index}`}>
                      <TableCell className="body-item">
                        {mentor.fullName}
                      </TableCell>
                      <TableCell className="body-item">
                        {mentor.email}
                      </TableCell>
                      <TableCell className="body-item">{mentor.role}</TableCell>
                      <TableCell className="body-item">{mentor.type}</TableCell>
                      <TableCell className="body-item" style={{ width: "0px" }}>
                        <div
                          className="remove-assign-mentor"
                          onClick={() => handleRemoveMentor(index)}
                        >
                          REMOVE
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="table-footer" colSpan={5}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="form-group">
              <div id="button" className="controller-assign">
                <button
                  className="btn button-discard"
                  type="button"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
                <button className="btn button-save" onClick={handleAddMentor} type="button">
                  Assign
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default AssignMentor;