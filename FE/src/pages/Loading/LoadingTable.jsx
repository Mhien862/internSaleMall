import {
    TableBody,
    TableCell,
    TableRow,
    Skeleton
} from "@mui/material";
import "./LoadingTable.scss"

const LoadingTable = (props) => {
    const cells = []
    const rows = []

    for (let j = 0; j < props.cell; j++) {
        if (j === (props.cell - 1)) {
            cells.push(
                <TableCell key={j} className="body-item last">
                    <Skeleton animation="wave" />
                </TableCell>)
        } else {
            cells.push(
                <TableCell key={j} className="body-item">
                    <Skeleton animation="wave" />
                </TableCell>)
        }
    }

    for (let i = 0; i < props.row; i++) {
        rows.push(
            <TableRow key={i} style={{ height: 40 }}>
                {cells}
            </TableRow>)
    }

    return (
        <>
            <TableBody className="table-skeleton">
                {rows}
                <TableRow>
                    <TableCell className="table-footer" colSpan={props.cell ? props.cell : 0}></TableCell>
                </TableRow>
            </TableBody>
        </>
    );
};

export default LoadingTable;