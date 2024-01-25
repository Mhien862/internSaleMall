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
import { setCoursesId, setCoursesData, getSchedule, getStatus } from "../../stores/slices/Courses";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/dist/moment";

const DetailCourseTable = () => {
    const [page, setPage] = useState(0);
    const statusTable = useSelector(getStatusTable)

    const data = useSelector(getSchedule);
    const dispatch = useDispatch();

    const createData = (topic, status, trainer, name_trainer, avatar_trainer, avatar_color, time, document, description, attendance) => {
        return { topic, status, trainer, name_trainer, avatar_trainer, avatar_color, time, document, description, attendance }
    };
    const rows = [];
    if (data && data.length > 0) {
        data.map((item) => {

            let col = []
            item.lessons.map(lesson => {
                return col.push(
                    createData(
                        lesson.name ? lesson.name : '-',
                        lesson.status.toUpperCase(),
                        lesson.trainer ? lesson.trainer : '',
                        lesson.user && lesson.user.name ? lesson.user.name : '-',
                        lesson.user && lesson.user.avatar ? lesson.user.avatar : '',
                        lesson.user && lesson.user.avatar ? '' : 'red',
                        lesson.date,
                        lesson.document_status ? lesson.document_status.toUpperCase() : '',
                        lesson.description ? lesson.description : '-',
                        lesson.attendance ? lesson.attendance : '-')
                );
            })

            let row = {
                category: item.name ? item.name : '-',
                lessons: col,
                id: 'category' + item.id
            }
            return rows.push(
                row
            );
        });
    }

    useEffect(() => {
        setPage(0)
    }, [statusTable]);

    const documentColor = (document) => {
        if (document.includes("MISSING")) {
            return "#D04234"
        }
        if (document.includes("UPDATED")) {
            return "#00D084"
        }
        return "#4E567A";
    }


    const statusColor = (status) => {
        if (status.includes("DONE")) {
            return "#4BEE22";
        }
        if (status.includes("CANCELED")) {
            return "#FF0000";
        }
        if (status.includes("NEXT")) {
            return "#D04234";
        }
        return "#968EAB";
    }

    return (
        <>
            <div className="table-container">
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="head-item">Category</TableCell>
                            <TableCell className="head-item">Topic</TableCell>
                            <TableCell className="head-item">Status</TableCell>
                            <TableCell className="head-item">Trainer</TableCell>
                            <TableCell className="head-item">Time</TableCell>
                            <TableCell className="head-item">Document</TableCell>
                            <TableCell className="head-item">Description</TableCell>
                            <TableCell className="head-item">Attendance</TableCell>
                            <TableCell className="head-item" align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {rows && rows.length > 0 ?
                        rows.map((rows) => (
                            <TableBody key={rows.id} className="table-body">
                                <TableRow style={{ height: 40 }}>
                                    <TableCell style={{ maxWidth: 85 }}
                                        rowSpan={rows.lessons.length}
                                        className="cut-text body-item">
                                        {rows.category}
                                    </TableCell>
                                    <>
                                        <TableCell style={{ maxWidth: 110 }} className="cut-text body-item">
                                            {rows.lessons[0].topic}
                                        </TableCell>
                                        <TableCell className="body-item">
                                            <Tag color={statusColor(rows.lessons[0].status)}>
                                                {rows.lessons[0].status.includes("NEXT") ? `NEXT LESSON` : rows.lessons[0].status}
                                            </Tag>
                                        </TableCell>
                                        <TableCell className="body-item">
                                            <div className="in-row">
                                                {rows.lessons[0].trainer ?
                                                    <Avatar src={rows.lessons[0].avatar_trainer}
                                                        sx={{ bgcolor: rows.lessons[0].avatar_color, width: '20px', height: '20px', mr: '5px', fontSize: '14px' }}>
                                                        {rows.lessons[0].name_trainer[0].toUpperCase()}
                                                    </Avatar>
                                                    : null}
                                                <span>{rows.lessons[0].name_trainer}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="body-item">{rows.lessons[0].time ? moment(rows.lessons[0].time).format("DD/MM/YYYY") : "-"}</TableCell>
                                        <TableCell className="body-item">
                                            <Tag color={documentColor(rows.lessons[0].document)}>
                                                {rows.lessons[0].document}
                                            </Tag>
                                        </TableCell>
                                        <TableCell style={{ maxWidth: 210 }} className="cut-text body-item">
                                            {rows.lessons[0].description}
                                        </TableCell>
                                        <TableCell className="body-item">{rows.lessons[0].attendance}</TableCell>
                                        <TableCell className="body-item actions" align="center">
                                            <div className="actions-img">
                                                <img src={img.MORE} alt="actions" />
                                            </div>
                                            <div className="dropdown-actions">
                                                <div className="view in-row">
                                                    <img src={img.DROPDOWN_6} alt="dropdown" />
                                                    <span>View</span>
                                                </div>
                                                <div className="mentor in-row" >
                                                    <img src={img.DROPDOWN_3} alt="dropdown" />
                                                    <span >Add Document</span>
                                                </div>
                                                <div className="edit in-row">
                                                    <img src={img.DROPDOWN_4} alt="dropdown" />
                                                    <span>Edit</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </>
                                </TableRow>
                                {rows.lessons.map((row, index) => {
                                    if (index !== 0) {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell style={{ maxWidth: 80 }} className="cut-text body-item">{row.topic}</TableCell>
                                                <TableCell className="body-item">
                                                    <Tag color={statusColor(row.status)}>
                                                        {row.status.includes("NEXT") ? `NEXT LESSON` : row.status}
                                                    </Tag>
                                                </TableCell>
                                                <TableCell className="body-item">
                                                    <div className="in-row">
                                                        {row.trainer ?
                                                            <Avatar src={row.avatar_trainer}
                                                                sx={{ bgcolor: row.avatar_color, width: '20px', height: '20px', mr: '5px', fontSize: '14px' }}>
                                                                {row.name_trainer[0].toUpperCase()}
                                                            </Avatar>
                                                            : null}
                                                        <span>{row.name_trainer}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="body-item">{row.time ? moment(row.time).format("DD/MM/YYYY") : "-"}</TableCell>
                                                <TableCell className="body-item">
                                                    <Tag color={documentColor(row.document)}>
                                                        {row.document}
                                                    </Tag>
                                                </TableCell>
                                                <TableCell style={{ maxWidth: 210 }} className="cut-text body-item">{row.description}</TableCell>
                                                <TableCell className="body-item">{row.attendance}</TableCell>
                                                <TableCell className="body-item actions" align="center">
                                                    <div className="actions-img">
                                                        <img src={img.MORE} alt="actions" />
                                                    </div>
                                                    <div className="dropdown-actions">
                                                        <div className="view in-row">
                                                            <img src={img.DROPDOWN_6} alt="dropdown" />
                                                            <span>View</span>
                                                        </div>
                                                        <div className="mentor in-row" >
                                                            <img src={img.DROPDOWN_3} alt="dropdown" />
                                                            <span >Add Document</span>
                                                        </div>
                                                        <div className="edit in-row">
                                                            <img src={img.DROPDOWN_4} alt="dropdown" />
                                                            <span>Edit</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>)
                                    }
                                }
                                )}
                                <TableRow>
                                    <TableCell className="table-footer" colSpan={9}></TableCell>
                                </TableRow>
                            </TableBody>
                        ))
                        : null}

                </Table>
            </div>
        </>
    );
};

export default DetailCourseTable;