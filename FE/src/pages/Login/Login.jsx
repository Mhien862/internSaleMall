import { FormInput, ShowPass, ChangeClass } from "../../components/index";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { handleLoginApi } from "../../services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../stores/slices/authSlice";
import { setOpen } from "../../stores/slices/Loading";
import { path } from "../../utils";
import { Button, Flex } from "antd";

const Login = () => {
  const email = FormInput("");
  const password = FormInput("");
  const showPass = ShowPass();
  const classEmail = ChangeClass("email-input", " missing");
  const classPass = ChangeClass("pass-input", " missing");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    let validate = validateLogin();
    if (validate) {
      try {
        navigate(path.USER_COURSES);
        dispatch(setOpen(true));
        let res = await handleLoginApi(email.value, password.value);
        let data = res.data;
        if (res && res.status === 200) {
          dispatch(login(data));
          dispatch(setOpen(false));
          toast.success(data.message, {
            className: "toast-message",
          });
        } else {
          throw new Error(data.message);
        }
      } catch (e) {
        dispatch(setOpen(false));
        toast.error(e, {
          className: "toast-message",
        });
      }
    }
  };

  const handlesignup = async () => {
    navigate(path.SIGNUP);
  };

  const validateLogin = () => {
    const re = /\S+@\S+\.\S+/;
    let checkEmail = email.value ? email.value.match(re) : "";
    console.log(password.value.length);
    if (!checkEmail) {
      classEmail.setClass(false);
    } else if (!(password.value.length > 8)) {
      classEmail.setClass(true);
      classPass.setClass(false);
    } else {
      classEmail.setClass(true);
      classPass.setClass(true);
      return true;
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-background">
          <div className="login">
            <div className="content">
              <div className="title">
                <span>Sign in</span>
              </div>
              <form className="form-login">
                <div className={classEmail.name}>
                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder="Enter your email"
                    {...email}
                  />
                  <div className="alert-input">
                    <i>
                      <FaExclamationCircle />
                    </i>
                    <span>Please use a valid email address</span>
                  </div>
                </div>
                <div className={classPass.name}>
                  <label htmlFor="password">Password</label>
                  <br />
                  {password.value ? (
                    <div
                      className="show-pass icon-input"
                      onClick={showPass.onClick}
                    >
                      {showPass.iconShow()}
                    </div>
                  ) : null}
                  <input
                    type={showPass.type}
                    className="form-control"
                    name="password"
                    placeholder="Enter your password"
                    {...password}
                  />
                  <div className="alert-input">
                    <i>
                      <FaExclamationCircle />
                    </i>
                    <span>Enter your password</span>
                  </div>
                </div>
              </form>
              <div className="controller-login">
                <div className="link-forgot">
                  <Link to={path.FORGOT}>
                    <span>Forgot password?</span>
                  </Link>
                </div>
                <Button onClick={handleLogin} type="primary" block>
                  Login
                </Button>
                <Button
                  onClick={handlesignup}
                  type="primary"
                  block
                  danger
                  ghost
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
