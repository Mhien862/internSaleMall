import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const ShowPass = () => {
    const [type, setType] = useState('password')

    const [show, setShow] = useState(false)

    const showPass = (reset) => {
        if (!show) {
            setType('text')
        } else {
            setType('password')
        }
        setShow(!show)
    }

    const iconShow = () => {
        if (!show) {
            return <FaRegEye />
        } else {
            return <FaRegEyeSlash />
        }
    }

    const resetShow = () => {
        setShow(false)
        setType('password')
    }

    const typeValue = {
        resetShow: resetShow,
        type: type,
        onClick: showPass,
        show: show,
        iconShow: iconShow
    }

    return typeValue;
}