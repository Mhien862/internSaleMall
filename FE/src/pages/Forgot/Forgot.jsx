import "./Forgot.scss";
import leftImg from "../../assets/img_forgot.svg";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { FormInput, ChangeClass } from "../../components/index";
import { forgotPasswordApi } from "../../services";
import { toast } from "react-toastify";
import { setOpen } from "../../stores/slices/Loading";
import { useDispatch } from "react-redux";
import { path } from "../../utils";
import { Button } from "antd";

const Forgot = () => {
  const classEmail = ChangeClass("email-input", " missing");
  const dispatch = useDispatch();

  const email = FormInput("");

  const handleForgot = async () => {
    let validate = validateForgot();
    if (validate) {
      try {
        dispatch(setOpen(true));
        let res = await forgotPasswordApi(email.value);
        let data = res.data;
        if (res && res.status === 200) {
          dispatch(setOpen(false));
          toast.success(data.message, {
            className: "toast-message",
          });
        } else {
          throw new Error(data.message);
        }
      } catch (e) {
        dispatch(setOpen(false));
        toast.error(e.message, {
          className: "toast-message",
        });
      }
    }
  };

  const validateForgot = () => {
    const re = /\S+@\S+\.\S+/;
    let checkEmail = email.value ? email.value.match(re) : "";
    if (!checkEmail) {
      classEmail.setClass(false);
    } else {
      classEmail.setClass(true);
      return true;
    }
  };

  return (
    <>
      <div className="forgot-container">
        <div className="forgot-background">
          <div className="forgot">
            <div className="content">
              <div className="title">
                <span>Forgot password</span>
              </div>
              <form className="form-forgot">
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
              </form>
              <div className="controller-forgot">
                <Button onClick={handleForgot} type="primary" block>
                  Send me an email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
