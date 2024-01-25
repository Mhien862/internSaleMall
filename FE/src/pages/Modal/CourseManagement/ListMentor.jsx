import { Modal, Box } from "@mui/material";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import "./AssignMentor.scss";
import { useEffect, useState } from "react";
import AssignMentor from "./AssignMentor";
import { useSelector, useDispatch } from "react-redux";
import { getDataUsers, getCoursesId, resetData, getStatus } from "../../../stores/slices/Courses";
import LoadingTable from "../../Loading/LoadingTable";

function ListMentor(props) {
    const [open, setOpen] = useState(false);
    const data = useSelector(getDataUsers)
    const statusAssign = useSelector(getStatus)
    const dispatch = useDispatch()

    const createData = (
        fullName,
        phone,
        email,
        role,
        level,
        workplace,
    ) => {
        return {
            fullName,
            phone,
            email,
            role,
            level,
            workplace,
        };
    };
    const rows = [];
    if (data && data.length > 0) {
        data.map((item) => {
            return rows.push(
                createData(
                    item.user.name,
                    item.user.phone,
                    item.user.email,
                    item.user.role.name,
                    item.user.level ? item.level : '-',
                    item.user.workplace ? item.workplace : '-'
                )
            );
        });
    }

    const handleClose = () => {
        setOpen(false);
        props.handleOpen()
    };

    const handleOpen = () => {
        setOpen(true);
        props.handleClose()
    };

    const handleDiscard = () => {
        dispatch(resetData())
        props.handleClose()
    };

    return (
        <>
            <AssignMentor open={open} handleClose={handleClose}></AssignMentor>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                className="modal-course"
            >
                <Box className="modal-content" style={{ width: "800px" }}>
                    <div className="container">
                        <div className="title">
                            <p>Trainer and Mentor</p>
                        </div>

                        <div className="table-container mt-1">
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="head-item">Mentor Name</TableCell>
                                        <TableCell className="head-item">Email</TableCell>
                                        <TableCell className="head-item">Role</TableCell>
                                        <TableCell className="head-item">Phone</TableCell>
                                        <TableCell className="head-item">Level</TableCell>
                                        <TableCell className="head-item">Workplace</TableCell>
                                        <TableCell className="head-item">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                {statusAssign.includes("loading") ?
                                    <LoadingTable row={3} cell={7}></LoadingTable>
                                    :
                                    <TableBody className="table-body">
                                        {rows.map((row, index) => (
                                            <TableRow style={{ height: 40 }} key={`trainer-${index}`}>
                                                <TableCell className="body-item">
                                                    {row.fullName}
                                                </TableCell>
                                                <TableCell className="body-item">
                                                    {row.email}
                                                </TableCell>
                                                <TableCell className="body-item">{row.role}</TableCell>
                                                <TableCell className="body-item">{row.phone}</TableCell>
                                                <TableCell className="body-item">{row.level}</TableCell>
                                                <TableCell className="body-item">{row.workplace}</TableCell>
                                                <TableCell className="body-item" style={{ width: "0px" }}>
                                                    <div
                                                        className="remove-assign-mentor"
                                                    >
                                                        DETAIL
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell className="table-footer" colSpan={7}></TableCell>
                                        </TableRow>
                                    </TableBody>
                                }
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
                                <button className="btn button-save" onClick={handleOpen} type="button">
                                    Add a new mentor
                                </button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default ListMentor;