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
import { ShowPass, ChangeClass } from "../../../components/index";
import { handleNewUserApi, handleGetAllUser } from "../../../services";
import { toast } from "react-toastify";
import { css } from "../../../utils";
import { DropdownIndicator, ClearIndicator } from "../../../components";
import Select from "react-select";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { setOpen } from "../../../stores/slices/Loading";

const NewAccount = (props) => {
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const handleAdditionalInfoClick = () => {
    setAdditionalInfo(!additionalInfo);
  };

  const missing = ChangeClass("form-group validate", " missing");
  const dispatch = useDispatch();
  const re = /\S+@\S+\.\S+/;
  const rePhone = /^\+?\d{10,15}$/
  const showPass = ShowPass();
  const showRePass = ShowPass();

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(re, "Invalid email address")
      .required("Required!"),
    role: Yup.string()
      .min(0, "Invalid role")
      .required("Required!"),
    phone: Yup.string()
      .matches(rePhone, "Invalid phone number")
      .required("Required!"),
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .required("Required!"),
    re_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required!"),
  })

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema), });

  const listRole = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Monitoring" },
    { value: "3", label: "Trainer" },
    { value: "4", label: "Student" },
  ];

  const listGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  useEffect(() => {
    if (!props.open) {
      reset()
      showPass.resetShow();
      showPass.resetShow();
    }
  }, [props.open]);

  const handleCreate = async (data) => {
    try {
      dispatch(setOpen(true))
      let res = await handleNewUserApi(data);
      dispatch(setOpen(false))
      let resData = res.data;
      toast.success(resData, {
        className: "toast-message",
      });
      dispatch(handleGetAllUser({ email: "", role: "" }));
      props.handleClose();
    } catch (e) {
      dispatch(setOpen(false))
      toast.error(e.message, {
        className: "toast-message",
      });
    }
  };

  return (
    <Modal open={props.open} onClose={props.handleClose} className="modal-user">
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
              onChange={(value) => setValue("role", value.value, { shouldValidate: true })}
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
          <div
            className={missing.MissingInput(errors.password)}
          >
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
              {watch('password') ? (
                <div
                  className="show-pass icon-input"
                  onClick={showPass.onClick}
                >
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
              {watch('re_password') ? (
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
          <div id="additional-info" onClick={handleAdditionalInfoClick}>
            {additionalInfo ? (
              <>
                <span>Additional Info</span>
                <i>
                  <FaChevronUp />
                </i>
              </>
            ) : (
              <>
                <span>Additional Info</span>
                <i>
                  <FaChevronDown />
                </i>
              </>
            )}
          </div>
          {additionalInfo && (
            <form>
              <div id="additional-info-content">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    {...register("name")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <Select
                    options={listGender}
                    // value={data.trainingForm}
                    onChange={(value) => setValue("gender", value.value)}
                    className="select-form"
                    styles={css.cssSelect}
                    components={{ ClearIndicator, DropdownIndicator }}
                    placeholder=""
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    className="form-control"
                    {...register("address")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birthday">Birthday</label>
                  <LocalizationProvider
                    className="date-container"
                    dateAdapter={AdapterMoment}
                  >
                    <DatePicker
                      maxDate={moment(Date.now())}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => setValue("birthday", moment(newValue).format("YYYY-MM-DD"))}
                      slotProps={css.slotDateProps}
                      sx={css.cssDatePicker}
                      components={{ OpenPickerIcon: FaRegCalendarAlt }}
                      className="date-picker"
                    />
                  </LocalizationProvider>
                </div>
                <div className="form-group">
                  <label htmlFor="startWorkingTime">Start Working Time</label>
                  <LocalizationProvider
                    className="date-container"
                    dateAdapter={AdapterMoment}
                  >
                    <TimePicker
                      maxTime={moment(getValues('end_working_time'), "h:mm A")}
                      onChange={(newValue) => setValue("start_working_time", moment(newValue).format("LT"))}
                      slotProps={css.slotTimeProps}
                      sx={css.cssDatePicker}
                      className="date-picker"
                    />
                  </LocalizationProvider>
                </div>
                <div className="form-group">
                  <label htmlFor="endWorkingTime">End Working Time</label>
                  <LocalizationProvider
                    className="date-container"
                    dateAdapter={AdapterMoment}
                  >
                    <TimePicker
                      minTime={moment(getValues('start_working_time'), "h:mm A")}
                      onChange={(newValue) => setValue("end_working_time", moment(newValue).format("LT"))}
                      slotProps={css.slotTimeProps}
                      sx={css.cssDatePicker}
                      className="date-picker"
                    />
                  </LocalizationProvider>
                </div>
                <div className="form-group">
                  <label htmlFor="grant">Grant</label>
                  <input
                    type="text"
                    id="grant"
                    className="form-control"
                    {...register("grant")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="manager">Manager</label>
                  <input
                    type="text"
                    id="manager"
                    className="form-control"
                    {...register("manager")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hiredDate">Hired Date</label>
                  <LocalizationProvider
                    className="date-container"
                    dateAdapter={AdapterMoment}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      maxDate={moment(Date.now())}
                      onChange={(newValue) => setValue("hired_date", moment(newValue).format("YYYY-MM-DD"))}
                      slotProps={css.slotDateProps}
                      sx={css.cssDatePicker}
                      components={{ OpenPickerIcon: FaRegCalendarAlt }}
                      className="date-picker"
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </form>
          )}
          <div id="button">
            <button
              className="btn button-discard"
              type="button"
              onClick={props.handleClose}
            >
              Discard
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
    </Modal>
  );
};

export default NewAccount;