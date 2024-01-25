import { useState, useEffect, useMemo } from "react";
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
  FaRegClock,
} from "react-icons/fa";
import { setData, resetData, getData, getStatus } from "../../../stores/slices/User";
import { useSelector, useDispatch } from "react-redux";
import { ChangeClass } from "../../../components/index";
import { handleEditUserApi, handleGetAllUser } from "../../../services";
import { toast } from "react-toastify";
import { css } from "../../../utils";
import { DropdownIndicator, ClearIndicator } from "../../../components";
import Select from "react-select";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { setOpen } from "../../../stores/slices/Loading";
import LoadingModal from "../../Loading/LoadingModal";

const EditAccount = (props) => {
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const handleAdditionalInfoClick = () => {
    setAdditionalInfo(!additionalInfo);
  };
  const missing = ChangeClass("form-group validate", " missing");
  const dataEdit = useSelector(getData);
  const statusEdit = useSelector(getStatus)
  const dispatch = useDispatch();
  const re = /\S+@\S+\.\S+/;
  const rePhone = /^\+?\d{10,15}$/

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(re, "Invalid email address")
      .required("Required!"),
    role_id: Yup.string()
      .min(0, "Invalid role")
      .required("Required!"),
    phone: Yup.string()
      .matches(rePhone, "Invalid phone number")
      .required("Required!"),
  })

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), defaultValues: dataEdit
  });

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
      dispatch(resetData());
    }
  }, [props.open]);

  useEffect(() => {
    reset(dataEdit)
  }, [dataEdit]);

  const handleEdit = async (data) => {
    try {
      dispatch(setOpen(true))
      let res = await handleEditUserApi(data);
      dispatch(setOpen(false))
      let dataEdit = res.data;
      if (res && res.status === 200) {
        toast.success(dataEdit.message, {
          className: "toast-message",
        });
        dispatch(handleGetAllUser({ email: "", role: "" }));
        props.handleClose();
      } else {
        throw new Error(dataEdit.message);
      }
    } catch (e) {
      dispatch(setOpen(false))
      toast.error(e.message, {
        className: "toast-message",
      });
    }
  };

  return (
    <Modal open={props.open} onClose={props.handleClose} className="modal-edit">
      <Box className="modal-content">
        {statusEdit.includes("loading") ?
          <LoadingModal></LoadingModal>
          :
          <div className="container">
            <div className="title">
              <p>Edit Account</p>
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
            <div className={missing.MissingInput(errors.role_id)}>
              <label htmlFor="role_id">Role</label>
              <span className="label">*</span>
              <br />
              <Select
                options={listRole}
                defaultValue={
                  dataEdit.role_id ?
                    listRole.filter(item =>
                      item.value.includes(dataEdit.role_id)) : ""
                }
                onChange={(value) => setValue("role_id", value.value, { shouldValidate: true })}
                className="select-form"
                styles={errors.role_id ? css.cssSelectValidate : css.cssSelect}
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
                      defaultValue={
                        dataEdit.gender ?
                          listGender.filter(item =>
                            item.value.includes(dataEdit.gender)) : ""
                      }
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
                        defaultValue={dataEdit.birthday ? moment(dataEdit.birthday) : null}
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
                        defaultValue={dataEdit.end_working_time ? moment(dataEdit.end_working_time, "h:mm A") : null}
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
                        defaultValue={dataEdit.start_working_time ? moment(dataEdit.start_working_time, "h:mm A") : null}
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
                        defaultValue={dataEdit.hired_date ? moment(dataEdit.hired_date) : null}
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
                onClick={props.handleClose}
                type="button"
              >
                Discard
              </button>
              <button
                className="btn button-save"
                onClick={handleSubmit(handleEdit)}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        }
      </Box>
    </Modal>
  );
};

export default EditAccount;