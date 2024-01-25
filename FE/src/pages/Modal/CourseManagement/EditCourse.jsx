import { useState, useEffect } from "react";
import "./NewCourse.scss";
import { Modal, Box } from "@mui/material";
import Select from "react-select";
import CourseSchedule from "./CourseSchedule";
import { ChangeClass } from "../../../components/index";
import {
    FaExclamationCircle,
    FaRegCalendarAlt,
} from "react-icons/fa";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment/dist/moment";
import { css } from "../../../utils";
import { DropdownIndicator, ClearIndicator } from "../../../components";
import { getUsersData } from "../../../stores/slices/User";
import { addSchedule, getLengthLessons, getSchedule, resetData, getMessage, getStatus, getError, getCoursesData } from "../../../stores/slices/Courses";
import { useSelector, useDispatch } from "react-redux";
import differenceWith from 'lodash/differenceWith'
import intersectionWith from 'lodash/intersectionWith'
import { handleEditCourses, handleGetAllCourses } from "../../../services";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "react-toastify";
import { setOpen } from "../../../stores/slices/Loading";
import LoadingModal from "../../Loading/LoadingModal";

const EditCourse = (props) => {
    const dispatch = useDispatch()
    const message = useSelector(getMessage)
    const error = useSelector(getError)
    const schedule = useSelector(getSchedule)
    const lesson = useSelector(getLengthLessons)
    const listUsers = useSelector(getUsersData)
    const dataEdit = useSelector(getCoursesData)
    const statusEdit = useSelector(getStatus)
    const missing = ChangeClass("form-group validate", " missing");

    const validationSchema = Yup.object({
        name_courses: Yup.string()
            .min(0, "Invalid name courses")
            .required("Required!"),
        training_form: Yup.string()
            .min(0, "Invalid training form")
            .required("Required!"),
        manager: Yup.string()
            .min(0, "Invalid manager")
            .required("Required!"),
        summary: Yup.string()
            .min(0, "Invalid summary")
            .required("Required!"),
    })

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema), defaultValue: dataEdit });

    const listTrainingForm = [
        { value: "In Office", label: "In Office" },
        { value: "Remote", label: "Remote" },
    ];
    const listTechnology = [
        { value: "1", technology_id: '1', label: "HTML" },
        { value: "2", technology_id: '2', label: "CSS" },
        { value: "3", technology_id: '3', label: "Javascript" },
        { value: "4", technology_id: '4', label: "ReactJS" },
        { value: "5", technology_id: '5', label: "NodeJS" },
    ];

    const initStudentUnassigned = [];
    if (listUsers && listUsers.length > 0) {
        listUsers.map((item, index) => {
            if (item.role_id === 4) {
                return initStudentUnassigned.push(
                    {
                        value: index,
                        user_id: item.id,
                        position: "Student",
                        label: item.name,
                    }
                )
            }
        });
    }

    const initManagerUnassigned = [];
    if (listUsers && listUsers.length > 0) {
        listUsers.map((item, index) => {
            if (item.role_id === 2) {
                return initManagerUnassigned.push(
                    {
                        value: item.id,
                        label: item.name,
                    }
                )
            }
        });
    }

    const listStudentUnassigned = differenceWith(initStudentUnassigned, getValues('students'), (a, b) => {
        return a.user_id === b.user_id
    })

    const [openCourseSchedule, setOpenCourseSchedule] = useState(false);
    const handleOpenCourseSchedule = () => {
        setOpenCourseSchedule(true);
        props.handleClose();
    };

    const handleCloseCourseSchedule = () => {
        setOpenCourseSchedule(false)
        props.handleOpen()
    };

    const handleCreateCourseSchedule = (data) => {
        setOpenCourseSchedule(false)
        dispatch(addSchedule(data))
        props.handleOpen()
    };

    useEffect(() => {
        if (!props.open && !openCourseSchedule) {
            reset()
            dispatch(resetData())
        }
    }, [props.open]);

    useEffect(() => {
        let valueTechnology = []

        if (dataEdit) {
            if (dataEdit.technology_courses && dataEdit.technology_courses.length > 0) {
                dataEdit.technology_courses.map((item) => {
                    return valueTechnology.push(listTechnology[item.technology_id - 1])
                })
            }
        }
        reset(dataEdit)
        setValue("technology", valueTechnology, { shouldValidate: true })
    }, [dataEdit]);

    useEffect(() => {
        let valueStudent = []
        if (dataEdit) {
            if (dataEdit.users_courses && dataEdit.users_courses.length > 0) {
                valueStudent = intersectionWith(initStudentUnassigned, dataEdit.users_courses, (a, b) => {
                    return a.user_id === b.user_id
                })
                setValue("students", valueStudent, { shouldValidate: true })
            }
        }
    }, [dataEdit, listUsers]);

    const handleEdit = async (data) => {
        let dataCourses
        let listSchedule = {
            lessons: lesson ? lesson : 0,
            categories: [],
        }

        if (schedule && schedule.length > 0) {
            schedule.map((item, index) => {
                listSchedule.categories.push({ id: item.id, name: item.name })
                listSchedule[index] = item.lessons
            })
        }

        dataCourses = Object.assign(data, listSchedule)
        delete dataCourses.technology_courses
        delete dataCourses.users_courses

        try {
            dispatch(setOpen(true))
            await dispatch(handleEditCourses(dataCourses)).unwrap();
            dispatch(setOpen(false))
            dispatch(handleGetAllCourses({ name: "", status: "" }));
            props.handleClose();
        } catch (e) {
            dispatch(setOpen(false))
            toast.error(error, {
                className: "toast-message",
            });
        }
    };

    useEffect(() => {
        if (statusEdit.includes("succeeded") && props.open) {
            toast.success(message, {
                className: "toast-message",
            });
        }
    }, [statusEdit]);

    return (
        <>
            <CourseSchedule
                openCourseSchedule={openCourseSchedule}
                handleClose={handleCloseCourseSchedule}
                handleCreate={handleCreateCourseSchedule}
            />

            <Modal
                open={props.open}
                onClose={props.handleClose}
                className="modal-course"
            >
                <Box className="modal-content">
                    {statusEdit.includes("loading") && !dataEdit ?
                        <LoadingModal></LoadingModal>
                        :
                        <div className="container">
                            <div className="title">
                                <p>Edit Course</p>
                            </div>

                            <div className={missing.MissingInput(errors.name_courses)}>
                                <label htmlFor="name_courses">Course Name</label>
                                <span className="label">*</span>
                                <br />
                                <input
                                    type="text"
                                    id="name_courses"
                                    className="form-control"
                                    {...register("name_courses")}
                                />
                                <div className="alert-input">
                                    <i>
                                        <FaExclamationCircle />
                                    </i>
                                    <span>Please enter a course name</span>
                                </div>
                            </div>

                            <div className={missing.MissingInput(errors.training_form)}>
                                <label htmlFor="training_form">Training Form</label>
                                <span className="label">*</span>
                                <br />
                                <Select
                                    options={listTrainingForm}
                                    defaultValue={
                                        getValues("training_form") ?
                                            listTrainingForm.filter(item =>
                                                item.value.includes(getValues("training_form"))) : ""
                                    }
                                    onChange={(value) => setValue("training_form", value.value, { shouldValidate: true })}
                                    styles={errors.training_form ? css.cssSelectValidate : css.cssSelect}
                                    components={{ ClearIndicator, DropdownIndicator }}
                                    placeholder=""
                                />
                                <div className="alert-input">
                                    <i>
                                        <FaExclamationCircle />
                                    </i>
                                    <span>Please enter a training form</span>
                                </div>
                            </div>

                            <div className={missing.MissingInput(errors.manager)}>
                                <label htmlFor="manager">Manager</label>
                                <span className="label">*</span>
                                <br />
                                <Select
                                    options={initManagerUnassigned}
                                    defaultValue={
                                        getValues("manager") ?
                                            initManagerUnassigned.filter(item =>
                                                item.value === getValues("manager")) : ""
                                    }
                                    onChange={(value) => setValue("manager", value.value, { shouldValidate: true })}
                                    styles={errors.manager ? css.cssSelectValidate : css.cssSelect}
                                    components={{ ClearIndicator, DropdownIndicator }}
                                    placeholder=""
                                />
                                <div className="alert-input">
                                    <i>
                                        <FaExclamationCircle />
                                    </i>
                                    <span>Please enter manager</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="training_location">Training Location</label>
                                <input
                                    type="text"
                                    id="training_location"
                                    className="form-control"
                                    {...register("training_location")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Technology</label>
                                <Select
                                    isMulti
                                    options={listTechnology}
                                    value={watch("technology") ? watch("technology") : ""}
                                    components={{ ClearIndicator, DropdownIndicator }}
                                    placeholder=""
                                    onChange={(value) => setValue("technology", value)}
                                    styles={css.cssSelect}
                                />
                            </div>

                            <div className="form-group">
                                <label>From Date</label>
                                <LocalizationProvider
                                    className="date-container"
                                    dateAdapter={AdapterMoment}
                                >
                                    <DatePicker
                                        minDate={moment(Date.now())}
                                        defaultValue={watch("from_date") ? moment(watch("from_date")) : null}
                                        format="DD/MM/YYYY"
                                        onChange={(newValue) => setValue("from_date", moment(newValue).format("YYYY-MM-DD"))}
                                        slotProps={css.slotDateProps}
                                        sx={css.cssDatePicker}
                                        components={{ OpenPickerIcon: FaRegCalendarAlt }}
                                        className="date-picker"
                                    />
                                </LocalizationProvider>
                            </div>

                            <div className="form-group">
                                <label>To Date</label>
                                <LocalizationProvider
                                    className="date-container"
                                    dateAdapter={AdapterMoment}
                                >
                                    <DatePicker
                                        minDate={moment(Date.now())}
                                        format="DD/MM/YYYY"
                                        defaultValue={watch("to_date") ? moment(watch("to_date")) : null}
                                        onChange={(newValue) => setValue("to_date", moment(newValue).format("YYYY-MM-DD"))}
                                        slotProps={css.slotDateProps}
                                        sx={css.cssDatePicker}
                                        components={{ OpenPickerIcon: FaRegCalendarAlt }}
                                        className="date-picker"
                                    />
                                </LocalizationProvider>
                            </div>

                            <div className="form-group">
                                <label>Fee</label>
                                <br />
                                <input
                                    className="form-control"
                                    type="text"
                                    {...register("fee")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Color</label>
                                <br />
                                <input
                                    className="form-control"
                                    type="text"
                                    {...register("color")}
                                />
                            </div>

                            <div className={missing.MissingInput(errors.summary)}>
                                <label>
                                    Summary <span className="label">*</span>
                                </label>
                                <br />
                                <textarea
                                    id="summary-text"
                                    className="form-control big-box"
                                    {...register("summary")}
                                ></textarea>
                                <div className="alert-input">
                                    <i>
                                        <FaExclamationCircle />
                                    </i>
                                    <span>Please enter summary</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Students</label>
                                <br />
                                <Select
                                    isMulti
                                    options={listStudentUnassigned}
                                    value={watch("students") ? watch("students") : ""}
                                    onChange={(value) => setValue("students", value)}
                                    components={{ ClearIndicator, DropdownIndicator }}
                                    styles={css.cssSelect}
                                    placeholder=""
                                />
                            </div>

                            <div className="form-group mt-20">
                                <div id="button-left" >
                                    <button
                                        className="btn button-save"
                                        type="button"
                                        onClick={handleOpenCourseSchedule}
                                    >
                                        Setup Schedule
                                    </button>
                                    <span>Category: {schedule ? schedule.length : 0} - Lesson: {lesson ? lesson : 0}</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <div id="button">
                                    <button
                                        className="btn button-discard"
                                        type="button"
                                        onClick={props.handleClose}
                                    >
                                        Discard
                                    </button>
                                    <button
                                        className="btn button-save"
                                        type="button"
                                        onClick={handleSubmit(handleEdit)}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </Box>
            </Modal>
        </>
    );
};

export default EditCourse;