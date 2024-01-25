import './SetNewPass.scss'
import leftImg from "../../assets/img_forgot.svg"
import { FaExclamationCircle } from "react-icons/fa";
import { FormInput, ShowPass, ChangeClass } from "../../components/index";
import { resetPasswordApi } from "../../services";
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from "react-router-dom";
import { setOpen } from "../../stores/slices/Loading";
import { useDispatch } from "react-redux";
import { path } from '../../utils';

const SetNewPass = () => {
    const password = FormInput('')
    const rePassword = FormInput('')
    const showPass = ShowPass()
    const showRePass = ShowPass()
    const classPass = ChangeClass('pass-input', ' missing')
    const classRePass = ChangeClass('re-pass-input', ' missing')
    let navigate = useNavigate()
    let [searchParams] = useSearchParams()
    const dispatch = useDispatch()

    const handleRePass = async () => {
        let validate = validateRepass()
        let token = searchParams.get('token')
        if (validate) {
            try {
                dispatch(setOpen(true))
                let res = await resetPasswordApi(token, password.value, rePassword.value);
                let data = res.data;
                if (res && res.status === 200) {
                    dispatch(setOpen(false))
                    toast.success(data.message, {
                        className: 'toast-message'
                    })
                    navigate(path.LOGIN)
                } else {
                    throw new Error(data.message);
                }
            } catch (e) {
                dispatch(setOpen(false))
                toast.error(e.message, {
                    className: 'toast-message'
                })
            }
        }
    }

    const validateRepass = () => {
        if (!(password.value.length > 8)) {
            classPass.setClass(false)
        } else if (!(rePassword.value.length > 8)) {
            classPass.setClass(true)
            classRePass.setClass(false)
        } else if (password.value !== rePassword.value) {
            classPass.setClass(false)
            classRePass.setClass(true)
        } else {
            classPass.setClass(true)
            classRePass.setClass(true)
            return true
        }
    }

    return (
        <>
            <div className="repass-container">
                <div className="repass-background">
                    <div className="repass-left">
                        <div className="left-content">
                            <div className="left-title">
                                <p>Welcome to <span>BlueOC Internship Program</span></p>
                            </div>
                            <div className="left-image">
                                <img src={leftImg} alt="left-image" />
                            </div>
                        </div>
                    </div>
                    <div className="repass-right">
                        <div className="right-content">
                            <div className="right-title">
                                <span>Setup Your New Password</span>
                            </div>
                            <form className="form-repass">
                                <div className={classPass.name}>
                                    <label htmlFor="password">Password</label><br />
                                    {password.value ?
                                        <div className="show-pass icon-input" onClick={showPass.onClick}>
                                            {showPass.iconShow()}
                                        </div>
                                        : null
                                    }
                                    <input type={showPass.type} className="form-control" name="password" placeholder="Enter your password"
                                        {...password}
                                    />
                                    <div className="alert-input">
                                        <i><FaExclamationCircle /></i>
                                        <span>Error! Confirm password not match</span>
                                    </div>
                                </div>
                                <div className={classRePass.name}>
                                    <label htmlFor="rePassword">RePassword</label><br />
                                    {rePassword.value ?
                                        <div className="show-pass icon-input" onClick={showRePass.onClick}>
                                            {showRePass.iconShow()}
                                        </div>
                                        : null
                                    }
                                    <input type={showRePass.type} className="form-control" name="rePassword" placeholder="Re-type your password here"
                                        {...rePassword}
                                    />
                                    <div className="alert-input">
                                        <i><FaExclamationCircle /></i>
                                        <span>Enter your RePassword</span>
                                    </div>
                                </div>
                            </form>
                            <div className="controller-repass">
                                <button className="btn"
                                    onClick={handleRePass}
                                >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SetNewPass