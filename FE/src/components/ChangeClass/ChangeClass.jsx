import { useState } from "react";

export const ChangeClass = (initClass, initAdd) => {
    const [name, setName] = useState(initClass)

    const setClass = (addClass) => {
        if (!addClass) {
            if (!name.includes(initAdd)) {
                setName(name.concat(initAdd))
            }
        } else {
            setName(name.replace(initAdd, ''))
        }
    }

    const MissingInput = (show) => {
        if (show) {
            return name.concat(initAdd)
        } else {
            return initClass
        }
    }

    const changeClass = {
        name: name,
        setClass: setClass,
        MissingInput: MissingInput,
    }

    return changeClass;
}