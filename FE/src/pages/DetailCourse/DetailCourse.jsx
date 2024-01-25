import { useEffect, useState } from "react";
import "./DetailCourse.scss";
import { img } from "../../utils";
import DetailCourseTable from "../PageTable/DetailCourseTable";
import { handleGetCourses, handleGetUserCourses, handleGetAssignUser, handleEditSchedule } from "../../services";
import ListStudents from "../Modal/CourseManagement/ListStudents";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setCoursesId, getCoursesData, getStatus, getError, getMessage } from "../../stores/slices/Courses";
import CourseSchedule from "../Modal/CourseManagement/CourseSchedule";
import { setOpen } from "../../stores/slices/Loading";
import DetailContent from "./DetailContent";
import TimeLine from "../TimeLine/TimeLine";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LoadingModal from "../Loading/LoadingModal";
import StatusCourse from "../Modal/CourseManagement/StatusCourse";

const DetailCourse = () => {
    const { pathname } = useLocation()
    const { id } = useParams()

    const status = useSelector(getStatus);
    const error = useSelector(getError);
    const course = useSelector(getCoursesData);
    const message = useSelector(getMessage)
    const dispatch = useDispatch();

    const [openAssignStudents, setOpenAssignStudents] = useState(false);
    const handleOpenAssignStudents = () => {
        dispatch(handleGetUserCourses({ course_id: id, position: 'Student' }))
        dispatch(handleGetAssignUser(`role=4`));
        dispatch(setCoursesId(id))
        setOpenAssignStudents(true)
    };
    const handleCloseStudents = () => setOpenAssignStudents(false);

    const [openCourseSchedule, setOpenCourseSchedule] = useState(false);
    const handleOpenCourseSchedule = () => {
        dispatch(handleGetAssignUser(`role=2&role=3&role=4`));
        setOpenCourseSchedule(true);
    };

    const handleCloseCourseSchedule = () => {
        setOpenCourseSchedule(false)
    };

    const handleCreateCourseSchedule = async (data) => {
        try {
            let listSchedule = {
                course_id: id,
                categories: [],
            }

            if (data && data.length > 0) {
                data.map((item, index) => {
                    listSchedule.categories.push({ id: item.id, name: item.name })
                    listSchedule[index] = item.lessons
                })
            }

            dispatch(setOpen(true))
            await dispatch(handleEditSchedule(listSchedule)).unwrap();
            dispatch(setOpen(false))
            dispatch(handleGetCourses({ course_id: id, detail: true }));
            setOpenCourseSchedule(false)
        } catch (e) {
            dispatch(setOpen(false))
            toast.error(error, {
                className: "toast-message",
            });
        }
    };

    useEffect(() => {
        if (status === "failed") {
            toast.error(error, {
                className: "toast-message",
            });
        }
        if (status.includes("succeeded") && openCourseSchedule) {
            toast.success(message, {
                className: "toast-message",
            });
        }
    }, [status]);

    useEffect(() => {
        if (id) {
            dispatch(handleGetCourses({ course_id: id, detail: true }));
        }
    }, [id, pathname])

    const [openStatus, setOpenStatus] = useState(false);
    const [isCancel, setIsCancel] = useState(false);
    const handleOpenStatus = (cancel) => {
        setIsCancel(cancel)
        setOpenStatus(true);
    };
    const handleCloseStatus = () => setOpenStatus(false);

    return (
        <div className="detail-course-container">
            <StatusCourse open={openStatus} isCancel={isCancel} handleClose={handleCloseStatus}></StatusCourse>
            {status.includes("loading") && !course ?
                <LoadingModal></LoadingModal>
                :
                <div className="detail-course-content">
                    <ListStudents open={openAssignStudents} handleOpen={() => setOpenAssignStudents(true)} handleClose={handleCloseStudents}></ListStudents>
                    <CourseSchedule
                        openCourseSchedule={openCourseSchedule}
                        handleClose={handleCloseCourseSchedule}
                        handleCreate={handleCreateCourseSchedule}
                    />
                    <div className="header">
                        <div className="main-content in-row">
                            <div className="title">
                                <span>{course && course.name ? course.name : null}</span>
                            </div>
                            <div className="actions">
                                <button className="edit btn" onClick={handleOpenAssignStudents}>Assign Student</button>
                                <button className="edit btn" onClick={handleOpenCourseSchedule}>Update Schedule</button>
                                <div className="more">
                                    <img src={img.MORE} alt="more" />
                                    <div className="dropdown-actions">
                                        {
                                            course ?
                                                !course.status.includes("Done") || !course.status.includes("Canceled") ?
                                                    <>
                                                        <div className="status in-row"
                                                            onClick={() => handleOpenStatus(false)}
                                                        >
                                                            <img src={img.DROPDOWN_3} alt="dropdown" />
                                                            <span>{
                                                                course.status.includes("Progress") ? "Finish" : "Start"}
                                                            </span>
                                                        </div>
                                                        <div className="status in-row"
                                                            onClick={() => handleOpenStatus(true)}
                                                        >
                                                            <img src={img.DROPDOWN_3} alt="dropdown" />
                                                            <span>Cancel</span>
                                                        </div>
                                                    </>
                                                    : null
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        <div className="timeline">
                            <TransformWrapper>
                                <TransformComponent>
                                    <TimeLine></TimeLine>
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                        <DetailContent></DetailContent>
                        <DetailCourseTable></DetailCourseTable>
                    </div>
                </div>
            }
        </div>
    );
};

export default DetailCourse;