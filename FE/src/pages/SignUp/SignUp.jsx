import { useEffect, useState } from "react";
import "./ModalUser.scss";
import { Modal, Box } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment/dist/moment";
import {
  FaChevronDown,
  FaChevronUp,
  FaExclamationCircle,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { ShowPass, ChangeClass } from "../../components/index";
import { handleNewUserApi, handleGetAllUser } from "../../services";
import { toast } from "react-toastify";
import { css } from "../../utils";
import { DropdownIndicator, ClearIndicator } from "../../components";
import Select from "react-select";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { setOpen } from "../../stores/slices/Loading";
import { path } from "../../utils";
import { Link, useNavigate } from "react-router-dom";

const NewAccount = (props) => {
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const handleAdditionalInfoClick = () => {
    setAdditionalInfo(!additionalInfo);
  };

  const missing = ChangeClass("form-group validate", " missing");
  const dispatch = useDispatch();
  const re = /\S+@\S+\.\S+/;
  const rePhone = /^\+?\d{10,15}$/;
  const showPass = ShowPass();
  const showRePass = ShowPass();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(re, "Invalid email address")
      .required("Required!"),
    role: Yup.string().min(0, "Invalid role").required("Required!"),
    phone: Yup.string()
      .matches(rePhone, "Invalid phone number")
      .required("Required!"),
    password: Yup.string().min(8, "Minimum 8 characters").required("Required!"),
    re_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required!"),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const listRole = [
    { value: "1", label: "Customer" },
    { value: "2", label: "VIP" },
  ];

  useEffect(() => {
    if (!props.open) {
      reset();
      showPass.resetShow();
      showPass.resetShow();
    }
  }, [props.open]);

  const handleCancle = async () => {
    navigate(path.LOGIN);
  };

  const handleCreate = async (data) => {
    try {
      navigate(path.LOGIN);
      dispatch(setOpen(true));
      let res = await handleNewUserApi(data);

      dispatch(setOpen(false));
      let resData = res.data;
      toast.success(resData, {
        className: "toast-message",
      });
      dispatch(handleGetAllUser({ email: "", role: "" }));

      props.handleClose();
    } catch (e) {
      dispatch(setOpen(false));
      toast.error(e.message, {
        className: "toast-message",
      });
    }
  };

  return (
    <Box className="modal-content">
      <div className="container">
        <div className="title">
          <p>New Account</p>
          <span>Account Info</span>
        </div>
        <div className={missing.MissingInput(errors.email)}>
          <label htmlFor="email">Email</label>
          <span className="label">*</span>
          <br />
          <input
            type="text"
            id="email"
            className="form-control"
            {...register("email")}
          />
          <div className="alert-input">
            <i>
              <FaExclamationCircle />
            </i>
            <span>Invalid email address</span>
          </div>
        </div>
        <div className={missing.MissingInput(errors.phone)}>
          <label htmlFor="phone">Phone Number</label>
          <span className="label">*</span>
          <br />
          <input
            type="text"
            id="phone-number"
            className="form-control"
            {...register("phone")}
          />
          <div className="alert-input">
            <i>
              <FaExclamationCircle />
            </i>
            <span>Invalid phone number</span>
          </div>
        </div>
        <div className={missing.MissingInput(errors.role)}>
          <label htmlFor="role">Role</label>
          <span className="label">*</span>
          <br />
          <Select
            options={listRole}
            // value={data.trainingForm}
            onChange={(value) =>
              setValue("role", value.value, { shouldValidate: true })
            }
            className="select-form"
            styles={errors.role ? css.cssSelectValidate : css.cssSelect}
            components={{ ClearIndicator, DropdownIndicator }}
            placeholder=""
          />
          <div className="alert-input">
            <i>
              <FaExclamationCircle />
            </i>
            <span>Invalid role</span>
          </div>
        </div>
        <div className={missing.MissingInput(errors.password)}>
          <label htmlFor="password">Password</label>
          <span className="label">*</span>
          <br />
          <div className="input-pass">
            <input
              type={showPass.type}
              id="password"
              className="form-control"
              {...register("password")}
            />
            {watch("password") ? (
              <div className="show-pass icon-input" onClick={showPass.onClick}>
                {showPass.iconShow()}
              </div>
            ) : null}
          </div>
          <div className="alert-input">
            <i>
              <FaExclamationCircle />
            </i>
            <span>Confirm password not match</span>
          </div>
        </div>
        <div className={missing.MissingInput(errors.re_password)}>
          <label htmlFor="rePassword">Re-Password</label>
          <span className="label">*</span>
          <br />
          <div className="input-pass">
            <input
              type={showRePass.type}
              id="re-password"
              className="form-control"
              {...register("re_password")}
            />
            {watch("re_password") ? (
              <div
                className="show-pass icon-input"
                onClick={showRePass.onClick}
              >
                {showRePass.iconShow()}
              </div>
            ) : null}
          </div>
          <div className="alert-input">
            <i>
              <FaExclamationCircle />
            </i>
            <span>Confirm password not match</span>
          </div>
        </div>

        <div id="button">
          <button
            onClick={handleCancle}
            className="btn button-discard"
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn button-save"
            type="button"
            onClick={handleSubmit(handleCreate)}
          >
            Create
          </button>
        </div>
      </div>
    </Box>
  );
};

export default NewAccount;
