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
import { setOpen } from "../../../stores/slices/Loading";
import { getDataUsers, getStatus, removeUsers, addUsers, getCoursesId, getError, getMessage, setCoursesId } from "../../../stores/slices/Courses";
import { handleAddUserCourses, handleGetAllCourses, handleGetUserCourses, handleGetCourses } from "../../../services";
import { getUsersData } from "../../../stores/slices/User";
import { toast } from "react-toastify";
import differenceWith from 'lodash/differenceWith'
import { SearchIndicator as DropdownIndicator } from "../../../components";
import { useParams } from "react-router-dom";

function AssignStudents(props) {
    const dispatch = useDispatch()
    const data = useSelector(getDataUsers)
    const status = useSelector(getStatus)
    const listStudent = useSelector(getUsersData)
    const course_id = useSelector(getCoursesId)
    const error = useSelector(getError)
    const message = useSelector(getMessage)
    const { id } = useParams()

    const createData = (
        id,
        fullName,
        email,
        yob,
        type
    ) => {
        return {
            id,
            fullName,
            email,
            yob,
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

    const initStudentUnassigned = [];
    if (listStudent && listStudent.length > 0) {
        listStudent.map((item, index) => {
            if (item.role_id === 4) {
                return initStudentUnassigned.push(
                    {
                        value: index,
                        user_id: item.id,
                        position: "Student",
                        label: item.name,
                        user: item,
                        type: "New",
                    }
                );
            }
        });
    }

    const listStudentUnassigned = differenceWith(initStudentUnassigned, data, (a, b) => {
        return a.user.id === b.user.id
    })

    const handleRemoveStudent = (index) => {
        dispatch(removeUsers(index))
    };

    const handleAddStudent = async () => {
        try {
            dispatch(setOpen(true))
            await dispatch(handleAddUserCourses({ course_id: course_id, users: data })).unwrap()
            dispatch(setOpen(false))

            if (id) {
                dispatch(handleGetCourses({ course_id: id, detail: true }));
            } else {
                dispatch(handleGetAllCourses({ name: "", status: "" }));
            }

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

    const handleSelectStudent = (value) => {
        dispatch(addUsers(value))
    };

    const handleDiscard = () => {
        if (id) {
            dispatch(handleGetUserCourses({ course_id: id, position: 'Student' }))
        } else {
            dispatch(handleGetUserCourses({ course_id: course_id, position: 'Student' }))
        }
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
                            <p>Assign Student</p>
                        </div>

                        <div className="form-group">
                            <div className="title-select">
                                <p>Find and add some candidates to this request</p>
                            </div>
                            <Select
                                options={listStudentUnassigned}
                                value=""
                                onChange={(value) => handleSelectStudent(value)}
                                className="select-form mt-1"
                                components={{ DropdownIndicator }}
                                placeholder="Select a mentor"
                                styles={css.cssSelect}
                            />
                        </div>

                        <div className="table-container mt-1">
                            <label>Selected Student</label>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="head-item">Students</TableCell>
                                        <TableCell className="head-item">Email</TableCell>
                                        <TableCell className="head-item">YOB</TableCell>
                                        <TableCell className="head-item">Type</TableCell>
                                        <TableCell className="head-item">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="table-body">
                                    {rows.map((student, index) => (
                                        <TableRow style={{ height: 40 }} key={`trainer-${index}`}>
                                            <TableCell className="body-item">
                                                {student.fullName}
                                            </TableCell>
                                            <TableCell className="body-item">
                                                {student.email}
                                            </TableCell>
                                            <TableCell className="body-item">{student.yob}</TableCell>
                                            <TableCell className="body-item">{student.type}</TableCell>
                                            <TableCell className="body-item" style={{ width: "0px" }}>
                                                <div
                                                    className="remove-assign-mentor"
                                                    onClick={() => handleRemoveStudent(index)}
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
                                <button className="btn button-save" onClick={handleAddStudent} type="button">
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

export default AssignStudents;
