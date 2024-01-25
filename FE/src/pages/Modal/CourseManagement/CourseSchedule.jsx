import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { img } from "../../../utils";
import Select from "react-select";
import "./CourseSchedule.scss";
import _ from "lodash";
import {
  FaChevronDown,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment/dist/moment";
import { css } from "../../../utils";
import { DropdownIndicator } from "../../../components";
import { getUsersData, getStatus } from "../../../stores/slices/User";
import { getSchedule } from "../../../stores/slices/Courses";
import { useSelector, useDispatch } from "react-redux";
import LoadingModal from "../../Loading/LoadingModal";

const CourseSchedule = (props) => {
  const cssDatePicker = {
    "& .MuiOutlinedInput-root": {
      height: "38px",
      padding: "7px 6px",
      pr: "14px",
      border: "2px solid #DFE1E6",
      borderRadius: "4px",
      "&:focus-within": {
        outline: "4px solid #cfe2ff",
        border: "2px solid rgba(13, 110, 253, 0.5)",
      },
      backgroundColor: "#FAFBFC",
      "& > fieldset": {
        border: "none",
      },
      "input": {
        "&::placeholder": {
          color: "#172B4D",
          opacity: "1"
        }
      }
    },
  };

  const slotProps = {
    openPickerIcon: { fontSize: "8" },
    textField: {
      placeholder: "Training Date",
      InputProps: {
        startAdornment: (<FaRegCalendarAlt className="lessons-date-icon" />),
      },
    },
    layout: {
      sx: {
        ".MuiPickersDay-root": {
          "&:focus-within": {
            outline: "none",
            border: "none",
          },
        },
      },
    },
  };

  const dispatch = useDispatch()
  const statusUser = useSelector(getStatus)
  const listUsers = useSelector(getUsersData)
  const schedule = useSelector(getSchedule)

  const initMentor = [];
  if (listUsers && listUsers.length > 0) {
    listUsers.map((item, index) => {
      if (item.role_id !== 4) {
        return initMentor.push(
          {
            value: item.id,
            label: item.name,
          }
        )
      }
    });
  }

  const listDurations = [
    { value: "1", label: "30 mins" },
    { value: "2", label: "1 hour" },
    { value: "3", label: "2 hours" },
    { value: "4", label: "3 hours" },
  ];

  const DateDownIcon = () => (
    <>
      <img src={img.arrowDown} />
    </>
  );

  const initLessons = {
    date: null,
    duration: null,
    name: null,
    trainer: null,
  }

  const initCategory = {
    name: "",
    lessons: [
      initLessons
    ],
  };
  const [categories, setCategories] = useState([initCategory]);

  const handleAddNewCategory = () => {
    setCategories((prevCategories) => [
      ...prevCategories,
      initCategory
    ]);
  };

  const handleOnchangeInput = (categoryIndex, field, value, childIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      if (field === "name") {
        newCategories[categoryIndex].name = value
      } else if (field === "name_lesson") {
        newCategories[categoryIndex].lessons[childIndex]["name"] = value;
      } else {
        newCategories[categoryIndex].lessons[childIndex][field] = value;
      }
      return newCategories;
    });
  };

  const handleAddNewInput = (categoryIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];

      if (categoryIndex < newCategories.length) {
        newCategories[categoryIndex].lessons.push(initLessons)
        // newCategories[categoryIndex] = {
        //   name: newCategories[categoryIndex].name,
        //   lessons: [
        //     ...newCategories[categoryIndex].lessons,
        //     {
        //       date: null,
        //       duration: null,
        //       name_lesson: "",
        //       trainer: null,
        //     },
        //   ],
        // };
      }

      return newCategories;
    });
  };

  const handleDeleteInput = (categoryIndex, childIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories[categoryIndex].lessons.splice(childIndex, 1);
      return newCategories;
    });
  };

  useEffect(() => {
    if (schedule && schedule.length > 0) {
      setCategories(JSON.parse(JSON.stringify(schedule)));
    } else {
      setCategories([initCategory]);
    }
  }, [props.openCourseSchedule]);

  return (
    <Modal
      open={props.openCourseSchedule}
      onClose={props.handleClose}
      className="modal-course"
    >
      <Box
        className="modal-content modal-course-schedule"
        style={{ width: "795px" }}
      >
        {statusUser.includes("loading") && !listUsers ?
          <LoadingModal></LoadingModal>
          :
          <div className="container">
            <div className="title">
              <p>Add course schedule</p>
            </div>

            <div className="form-group">
              <label style={{ fontSize: "16px" }}>
                Multiple Category for course
              </label>
            </div>

            <div className="form-group">
              {categories ?
                categories.map((category, categoryIndex) => (
                  <div key={`category-${categoryIndex}`}>
                    <input
                      value={category.name || ''}
                      onChange={(event) =>
                        handleOnchangeInput(
                          categoryIndex,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Category name"
                      className="form-control mb-20"
                    />

                    {category.lessons ?
                      category.lessons.map((child, childIndex) => (
                        <div
                          className="lessons"
                          key={`child-${childIndex}`}
                          style={{ display: "flex" }}
                        >
                          <div className="form-group date-lessons">
                            <LocalizationProvider
                              className="date-container"
                              dateAdapter={AdapterMoment}
                            >
                              <DatePicker
                                defaultValue={child.date ? moment(child.date) : null}
                                minDate={moment(Date.now())}
                                onChange={(newValue) =>
                                  handleOnchangeInput(
                                    categoryIndex,
                                    "date",
                                    newValue,
                                    childIndex
                                  )
                                }
                                slotProps={slotProps}
                                sx={cssDatePicker}
                                components={{
                                  OpenPickerIcon: DateDownIcon,
                                }}
                                className="date-picker"
                              />
                            </LocalizationProvider>
                          </div>

                          <div className="form-group select-duration">
                            <Select
                              options={listDurations}
                              defaultValue={child.duration ?
                                listDurations.filter(item =>
                                  item.value.includes(child.duration)) : ""
                              }
                              onChange={(value) =>
                                handleOnchangeInput(
                                  categoryIndex,
                                  "duration",
                                  value.value,
                                  childIndex
                                )
                              }
                              components={{ DropdownIndicator }}
                              placeholder="Duration"
                              styles={css.cssSelect}
                            />
                          </div>

                          <div className="form-group lesson-name">
                            <input
                              value={child.name || ''}
                              onChange={(event) =>
                                handleOnchangeInput(
                                  categoryIndex,
                                  "name_lesson",
                                  event.target.value,
                                  childIndex
                                )
                              }
                              className="form-control"
                              placeholder="Add the lesson name here"
                            />
                          </div>

                          <div className="form-group select-mentor">
                            <Select
                              options={initMentor}
                              defaultValue={child.trainer ?
                                initMentor.filter(item =>
                                  item.value === child.trainer) : ""
                              }
                              onChange={(value) =>
                                handleOnchangeInput(
                                  categoryIndex,
                                  "trainer",
                                  value.value,
                                  childIndex
                                )
                              }
                              components={{ DropdownIndicator }}
                              styles={css.cssSelect}
                              placeholder="Select Trainer"
                            />
                          </div>

                          {childIndex >= 1 ? (
                            <img
                              src={img.deleteIcon}
                              className="add-delete-icon"
                              onClick={() =>
                                handleDeleteInput(categoryIndex, childIndex)
                              }
                            />
                          ) : (
                            <img
                              src={img.add}
                              className="add-delete-icon"
                              onClick={() => handleAddNewInput(categoryIndex)}
                            />
                          )}
                        </div>
                      ))
                      : null}

                    <div className="separate">
                      <div></div>
                    </div>
                  </div>
                ))
                : null}
            </div>

            <div className="form-group">
              <div id="button-left">
                <button
                  className="btn button-save"
                  type="button"
                  onClick={handleAddNewCategory}
                >
                  New Category
                </button>
              </div>
            </div>

            <div className="form-group">
              <div id="button">
                <button
                  className="btn button-discard"
                  type="button"
                  onClick={props.handleClose}
                >
                  Discard
                </button>
                <button className="btn button-save" type="button" onClick={() => props.handleCreate(categories)}>
                  Create
                </button>
              </div>
            </div>
          </div>
        }
      </Box>
    </Modal>
  );
};

export default CourseSchedule;