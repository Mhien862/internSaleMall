import { useState, useEffect } from "react";
import "./StatusCourse.scss";
import { Modal, Box } from "@mui/material";
import {
    handleChangeStatusCourses,
    handleGetCourses
} from "../../../services";
import { toast } from "react-toastify";
import { getCoursesData, getMessage, getStatus, getError } from "../../../stores/slices/Courses";
import { useSelector, useDispatch } from "react-redux";
import { img } from "../../../utils";
import moment from "moment/dist/moment";
import { setOpen } from "../../../stores/slices/Loading";

const StatusCourse = (props) => {
    const course = useSelector(getCoursesData);
    const dispatch = useDispatch();
    const message = useSelector(getMessage)
    const error = useSelector(getError)
    const statusApi = useSelector(getStatus)
    let status = course && course.status ? course.status : "";;
    let id = course && course.id ? course.id : "";

    const handleChangeStatusCourse = () => {
        (async () => {
            let changeStatus
            if (props.isCancel) {
                changeStatus = 'Canceled'
            } else if (status.includes("Progress")) {
                changeStatus = 'Done'
            } else {
                changeStatus = 'Progress'
            }

            try {
                dispatch(setOpen(true))
                await dispatch(handleChangeStatusCourses({ id: id, status: changeStatus })).unwrap();
                dispatch(setOpen(false))
                dispatch(handleGetCourses({ course_id: id, detail: true }));
                props.handleClose();
            } catch (e) {
                dispatch(setOpen(false))
                toast.error(error, {
                    className: "toast-message",
                });
            }

        })();
    };

    useEffect(() => {
        if (statusApi.includes("succeeded") && props.open) {
            toast.success(message, {
                className: "toast-message",
            });
        }
    }, [statusApi]);

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            className="modal-active active"
        >
            <Box className="modal-content">
                <div className="container">
                    <div className="title">
                        {!props.isCancel ? (
                            status.includes("Progress") ?
                                (<>
                                    <p>Finish course</p>
                                    <span>
                                        Are you sure to finish this course?
                                    </span>
                                </>)
                                :
                                (<>
                                    <p>Start course</p>
                                    <span>
                                        The start date time of this course will be modified to {moment().format("DD/MM/YYYY")}. Are you sure to start this course?
                                    </span>
                                </>)
                        ) : (
                            <>
                                <p>
                                    <img src={img.ERR} alt="disable-icon" />
                                    <span>Cancel course</span>
                                </p>
                                <span>{
                                    status.includes("Progress") ?
                                        "This course is in progress. Are you sure to cancel this course?"
                                        :
                                        "Are you sure to cancel this course?"}
                                </span>
                            </>
                        )}
                    </div>
                    <div id="button">
                        <button
                            className="btn button-discard"
                            onClick={props.handleClose}
                            type="button"
                        >
                            Discard
                        </button>
                        {!props.isCancel ? (
                            <button
                                className="btn button-save"
                                type="button"
                                onClick={handleChangeStatusCourse}
                            >
                                {
                                    status.includes("Progress") ?
                                        "Finish" : "Yes. Start it"
                                }
                            </button>
                        ) : (
                            <button
                                className="btn button-disable"
                                type="button"
                                onClick={handleChangeStatusCourse}
                            >
                                Yes. Cancel it
                            </button>
                        )}
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default StatusCourse;