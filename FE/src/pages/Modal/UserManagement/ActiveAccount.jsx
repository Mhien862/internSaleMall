import { useState } from "react";
import "./ModalUser.scss";
import { Modal, Box } from "@mui/material";
import {
  handleChangeStatusApi,
  handleGetAllUser,
} from "../../../services/User";
import { toast } from "react-toastify";
import { getData } from "../../../stores/slices/User";
import { useSelector, useDispatch } from "react-redux";
import { img } from "../../../utils";
import { setOpen } from "../../../stores/slices/Loading";

const ActiveAccount = (props) => {
  const user = useSelector(getData);
  const dispatch = useDispatch();
  let email = user && user.email ? user.email : "";
  let status = "";
  let id = user && user.id ? user.id : "";

  if (user && user.account && user.account.status) {
    status = user.account.status;
  }

  const handleChangeStatusAccount = () => {
    (async () => {
      dispatch(setOpen(true))
      await handleChangeStatusApi({ id }).then((response) => {
        if (response.status === 200) {
          dispatch(setOpen(false))
          toast.success(response.data.message, {
            className: "toast-message",
          });
          dispatch(handleGetAllUser({ email: "", role: "" }));
          props.handleClose();
        } else {
          dispatch(setOpen(false))
          toast.error(response.data.message, {
            className: "toast-message",
          });
          props.handleClose();
        }
      });
    })();
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      className="modal-active active"
    >
      <Box className="modal-content">
        <div className="container">
          <div className="title">
            {status === "Inactive" ? (
              <>
                <p>Enable Account</p>
                <span>Are you sure to enable "{email}" account?</span>
              </>
            ) : (
              <>
                <p>
                  <img src={img.ERR} alt="disable-icon" />
                  <span>Disable Account</span>
                </p>
                <span>Are you sure to disable "{email}" account?</span>
              </>
            )}
          </div>
          <div id="button">
            <button
              className="btn button-discard"
              onClick={props.handleClose}
              type="button"
            >
              Discard
            </button>
            {status === "Inactive" ? (
              <button
                className="btn button-save"
                type="button"
                onClick={handleChangeStatusAccount}
              >
                Yes. Enable it
              </button>
            ) : (
              <button
                className="btn button-disable"
                type="button"
                onClick={handleChangeStatusAccount}
              >
                Yes. Disable it
              </button>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ActiveAccount;
