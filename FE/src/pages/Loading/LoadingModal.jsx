import {
    Skeleton
} from "@mui/material";
import './LoadingModal.scss'

const LoadingModal = (props) => {

    return (
        <div className="container">
            <div className="content-loading">
                <Skeleton animation="wave" className="head" />
                <Skeleton animation="wave" className="body" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
            </div>
        </div>
    );
};

export default LoadingModal;