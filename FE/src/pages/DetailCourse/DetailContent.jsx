import { useEffect, useState } from 'react';
import './DetailContent.scss'
import { useSelector, useDispatch } from "react-redux";
import { getCoursesData, getStatus, getError } from "../../stores/slices/Courses";
import { Badge, Box, LinearProgress, Avatar, AvatarGroup } from '@mui/material'
import moment from 'moment';
import { Tag } from "antd";

const DetailContent = () => {
    const course = useSelector(getCoursesData);
    const dispatch = useDispatch();
    const [content, setContent] = useState("")
    const [listUser, setListUser] = useState("")

    const statusColor = (status) => {
        if (status.includes("PROGRESS")) {
            return "#F66438";
        }
        if (status.includes("DONE")) {
            return "#00D084";
        }
        if (status.includes("CANCELED")) {
            return "#FF0000";
        }
        return "#9337BE";
    }

    useEffect(() => {
        const listMentor = []
        const listStudent = []

        if (course) {
            setContent({
                summary: course.summary ? course.summary : "In Update...",
                progress: course.progress ? course.progress : 0,
                lessons: course.lessons ? course.lessons : 0,
                training_form: course.training_form ? course.training_form : "In Update...",
                from_date: course.from_date ? moment(course.from_date).format("DD/MM/YYYY") : "In Update...",
                to_date: course.to_date ? moment(course.to_date).format("DD/MM/YYYY") : "In Update...",
                training_location: course.training_location ? course.training_location : "In Update...",
                reminder: course.reminder ? course.reminder : 0,
                status: course.status.toUpperCase(),
                fee: course.fee ? course.fee : "In Update..."
            })

            if (course.users_courses) {
                course.users_courses.map(item => {
                    if (item.position.includes('Mentor')) {
                        listMentor.push(item.user.name)
                    } else {
                        listStudent.push({
                            avatar: item.user.avatar,
                            default: item.user.name[0].toUpperCase()
                        })
                    }
                })
            }
            setListUser({
                Mentor: listMentor,
                Student: listStudent
            })
        };
    }, [course])

    const randomColor = () => {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        let color = "#" + hex.toString(16);

        return color;
    }

    return (
        <div className='container-detail-content'>
            <div className='content-detail'>
                <div className='course-info head'>
                    <span className='title'>
                        Summary
                    </span>
                    <p className='content'>
                        {content ? content.summary : "-"}
                    </p>
                </div>
                <div className='body in-row'>
                    <div className='left'>
                        <div className='course-info in-row'>
                            <span className='title'>
                                Trainer:
                            </span>
                            <div className='content'>
                                {listUser.Mentor && listUser.Mentor.length > 0 ?
                                    listUser.Mentor.map((item, index) => {
                                        return (
                                            <span key={index}>{index === 0 ? '' : ", "}{item}</span>
                                        )
                                    })
                                    : "-"
                                }
                            </div>
                        </div>
                        <div className='course-info in-row'>
                            <span className='title'>
                                Training form:
                            </span>
                            <span className='content'>
                                {content ? content.training_form : "-"}
                            </span>
                        </div>
                        <div className='course-info'>
                            <span className='title'>
                                Training location:
                            </span>
                            <span className='content'>
                                {content ? content.training_location : "-"}
                            </span>
                        </div>
                        <div className='course-info students'>
                            <span className='title'>
                                Students:
                            </span>
                            <div className='content'>
                                <AvatarGroup max={12}>
                                    {listUser.Student && listUser.Student.length > 0 ?
                                        listUser.Student.map((item, index) => {
                                            if (item.avatar) {
                                                return (
                                                    <Avatar key={index} alt="avatar" src={item.avatar}
                                                        sx={{
                                                            width: '35px',
                                                            height: '35px',
                                                        }}
                                                    />
                                                )
                                            }
                                            return (
                                                <Avatar key={index} alt="avatar" src=''
                                                    sx={{
                                                        width: '35px',
                                                        height: '35px',
                                                        backgroundColor: randomColor()
                                                    }}>
                                                    {item.default}
                                                </Avatar>
                                            )
                                        })
                                        : ""
                                    }
                                </AvatarGroup>
                            </div>
                        </div>
                        <div className='course-info in-row'>
                            <span className='title'>
                                Remaining Reminder:
                            </span>
                            <div className='content reminder'>
                                <Badge
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            minWidth: "24px",
                                            height: "17px",
                                            color: "white",
                                            backgroundColor: "#26AF36"
                                        }
                                    }}
                                    badgeContent={content ? content.reminder : 0}
                                    showZero>
                                </Badge>

                            </div>
                        </div>
                    </div>
                    <div className='right'>
                        <div className='course-info in-row'>
                            <span className='title'>
                                Status:
                            </span>
                            <div className='content'>
                                {content ?
                                    <Tag color={statusColor(content.status)}>
                                        {content.status.includes("PROGRESS") ? `IN PROGRESS` : content.status}
                                    </Tag>
                                    : "-"}
                            </div>
                        </div>
                        <div className='course-info in-row'>
                            <span className='title'>
                                Training time:
                            </span>
                            <span className='content'>
                                {content ? `${content.from_date} - ${content.to_date}` : "-"}
                            </span>
                        </div>
                        <div className='course-info'>
                            <span className='title'>
                                Training Fee:
                            </span>
                            <span className='content'>
                                {content ? content.fee : "-"}
                            </span>
                        </div>
                        <div className='course-info'>
                            <span className='title'>
                                Training Progress:
                            </span>
                            <span className='content'>
                                {content ? `${content.progress}/${content.lessons} lesson` : "-"}
                            </span>
                        </div>
                        <div className='course-info'>
                            <Box sx={{ width: '75%' }}>
                                <LinearProgress
                                    variant="determinate"
                                    sx={{
                                        backgroundColor: '#EBECF0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#3FEE22'
                                        }
                                    }}
                                    value={Math.ceil((content.progress / content.lessons) * 100) || 0} />
                            </Box>
                        </div>
                    </div>
                </div>
                <div className='footer'>
                    <div className='course-info'>
                        <span className='title'>
                            Detailed schedule
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailContent