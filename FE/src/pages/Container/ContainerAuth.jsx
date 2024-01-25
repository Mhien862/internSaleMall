import { Outlet, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { isLogin, getStatus } from "../../stores/slices/authSlice";
import { useEffect, useState } from "react";
import { handleGetUserAccount } from "../../services";
import { Backdrop, CircularProgress } from '@mui/material';
import { getOpen } from "../../stores/slices/Loading";

const ContainerAuth = () => {
    const isLoggedIn = useSelector(isLogin)
    const status = useSelector(getStatus)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const open = useSelector(getOpen)
    const [isHide, setIsHide] = useState(true);

    setTimeout(() => setIsHide(false), 1000);

    const getAccount = async () => {
        try {
            dispatch(handleGetUserAccount(dispatch))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        } else {
            getAccount()
        }
    }, [isLoggedIn])

    return (
        <>
            {!isLoggedIn ?
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 500 }}
                    open={open}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                : null
            }
            {status !== 'loading' && !isHide ?
                <Outlet></Outlet>
                : null
            }
        </>
    )
}

export default ContainerAuth