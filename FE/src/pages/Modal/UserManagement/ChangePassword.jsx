import { useState, useEffect } from "react";
import "./ModalUser.scss";
import { Modal, Box } from "@mui/material";
import { handleChangePasswordApi } from "../../../services/User";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaExclamationCircle } from "react-icons/fa";
import { ShowPass, ChangeClass } from "../../../components/index";
import { getData } from "../../../stores/slices/User";
import { useSelector, useDispatch } from "react-redux";
import { setOpen } from "../../../stores/slices/Loading";

const ChangePassword = (props) => {
  const missing = ChangeClass("form-group validate", " missing");
  const showPass = ShowPass();
  const showRePass = ShowPass();
  const user = useSelector(getData);
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      password: "",
      re_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
      re_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      const id = user.id;
      const password = values.password;
      const data = { id, password };
      (async () => {
        dispatch(setOpen(true))
        await handleChangePasswordApi(data).then((response) => {
          if (response.status === 200) {
            dispatch(setOpen(false))
            toast.success(response.data.message, {
              className: "toast-message",
            });
            props.handleClose();
            formik.values.password = "";
            formik.values.re_password = "";
          } else {
            dispatch(setOpen(false))
            toast.error(response.data.message, {
              className: "toast-message",
            });
            props.handleClose();
            formik.values.password = "";
            formik.values.re_password = "";
          }
        });
      })();
    },
  });

  useEffect(() => {
    if (!props.open) {
      formik.resetForm();
      showPass.resetShow();
      showPass.resetShow();
    }
  }, [props.open]);

  return (
    <Modal open={props.open} onClose={props.handleClose} className="modal-user">
      <Box className="modal-content">
        <div className="container">
          <div className="title">
            <p>Change Password</p>
            <span>Account Info</span>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div
              className={missing.MissingInput(
                formik.errors.password && formik.touched.password
              )}
            >
              <label htmlFor="password">Password</label>
              <br />
              <div className="input-pass">
                <input
                  type={showPass.type}
                  name="password"
                  id="password"
                  className="form-control"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.values.password ? (
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
                <span>{formik.errors.password}</span>
              </div>
            </div>
            <div
              className={missing.MissingInput(
                formik.errors.re_password && formik.touched.password
              )}
            >
              <label htmlFor="re_password">Re-Password</label>
              <br />
              <div className="input-pass">
                <input
                  type={showRePass.type}
                  name="re_password"
                  id="re_password"
                  className="form-control"
                  value={formik.values.re_password}
                  onChange={formik.handleChange}
                />
                {formik.values.re_password ? (
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
                <span>{formik.errors.re_password}</span>
              </div>
            </div>
            <div id="button">
              <button
                className="btn button-discard"
                type="button"
                onClick={props.handleClose}
              >
                Discard
              </button>
              <button className="btn button-save" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default ChangePassword;
