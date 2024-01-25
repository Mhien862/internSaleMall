export const path = {
    HOME: "/",
    LOGIN: "/login",
    FORGOT: "/forgot",
    RESET_PASSWORD: "/reset-password",
    USER_MANAGEMENT: "/accounts",
    USER_COURSES: "/courses",
    PROFILE: "/profile",
    DETAIL_COURSE: "/courses/:id",
    SIGNUP: "/signup"
}

export const css = {

    cssDatePicker: {
        "& .MuiOutlinedInput-root": {
            height: "35px",
            padding: "5px 6px",
            pr: "14px",
            border: "2px solid #DFE1E6",
            "&:focus-within": {
                outline: "4px solid #cfe2ff",
                border: "2px solid rgba(13, 110, 253, 0.5)",
            },
            backgroundColor: "#FAFBFC",
            "& > fieldset": {
                border: "none",
            },
        },
    },

    slotDateProps: {
        openPickerIcon: { fontSize: "18" },
        textField: { placeholder: "" },
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
    },

    slotTimeProps: {
        openPickerIcon: { fontSize: "small" },
        textField: { placeholder: "" },
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
    },

    cssSelect: {
        overflow: "scroll",
        "&:hover": {
            border: "none",
            boxShadow: "none"
        },
        control: (provided, state) => ({
            ...provided,
            "&:hover": {
                borderColor: state.isFocused ? "rgba(13, 110, 253, 0.5)" : "#DFE1E6"
            },
            fontSize: '14px',
            backgroundColor: "#FAFBFC",
            color: "rgba(122, 134, 154, 1)",
            boxShadow: "none",
            outline: state.isFocused && "4px solid #cfe2ff",
            border: state.isFocused ? "2px solid rgba(13, 110, 253, 0.5)" : "2px solid #DFE1E6"
        }),
        option: (provided, state) => ({
            ...provided,
            "&:hover": {
                color: state.isSelected ? "white" : "rgba(122, 134, 154, 1)"
            },
            fontSize: '14px',
            color: state.isSelected ? "white" : "rgba(122, 134, 154, 1)",
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            padding: '0 6px',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            fontSize: '14px',
            color: "rgba(122, 134, 154, 1)",
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            padding: '0px',
            paddingLeft: '0px',
            paddingTop: '0px',
            paddingRight: '0px',
            paddingDown: '0px',
        }),
    },

    cssSelectValidate: {
        overflow: "scroll",
        "&:hover": {
            border: "none",
            boxShadow: "none",
        },
        control: (provided, state) => ({
            ...provided,
            "&:hover": {
                borderColor: "red"
            },
            fontSize: '14px',
            backgroundColor: "#FAFBFC",
            color: "rgba(122, 134, 154, 1)",
            boxShadow: "none",
            outline: state.isFocused && "4px solid #cfe2ff",
            border: state.isFocused ? "2px solid rgba(13, 110, 253, 0.5)" : "1px solid red"
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
            color: "rgba(122, 134, 154, 1)",
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            padding: '0 6px'
        }),
        singleValue: (provided, state) => ({
            ...provided,
            fontSize: '14px',
            color: "rgba(122, 134, 154, 1)",
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            padding: '0px',
            paddingLeft: '0px',
            paddingTop: '0px',
            paddingRight: '0px',
            paddingDown: '0px',
        }),
    },

    cssSelectFilter: {
        overflow: "scroll",
        "&:hover": {
            border: "none",
            boxShadow: "none",
        },
        control: (provided, state) => ({
            ...provided,
            "&:hover": {
                borderColor: state.isFocused ? "rgba(13, 110, 253, 0.5)" : "#DFE1E6"
            },
            fontSize: '14px',
            minHeight: '32px',
            height: '32px',
            backgroundColor: "#FAFBFC",
            color: "#7A869A",
            boxShadow: "none",
            outline: state.isFocused && "4px solid #cfe2ff",
            border: state.isFocused ? "1px solid rgba(13, 110, 253, 0.5)" : "1px solid #ccc"
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: '32px',
            padding: '0 6px',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            fontSize: '14px',
            color: "rgba(122, 134, 154, 1)",
        }),
        input: (provided, state) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '32px',
        }),
    }

}