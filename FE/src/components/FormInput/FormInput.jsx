import { useState } from "react";

export const FormInput = (initValue) => {
    const [value, setValue] = useState(initValue)

    const onChangeHandle = (event) => {
        if (event) {
            setValue(event.target.value)
        } else {
            setValue('')
        }
    }

    const inputValue = {
        value: value,
        onChange: onChangeHandle,
    }

    return inputValue;
}