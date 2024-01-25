export const Validate = (data) => {

    const re = /\S+@\S+\.\S+/;

    const checkEmail = (data) => {
        let check = data ? data.match(re) : "";
        if (check) {
            return true
        } else {
            return false
        }
    }

    const checkPassword = (data) => {
        switch (data) {
            case data.search(/[a-z]/) >= 0:
                return false;
            case data.search(/[A-Z]/) >= 0:
                return false;
            case data.search(/[0-9]/) >= 0:
                return false;
            case data.search(/\W/) >= 0:
                return false;
            case data.length >= 8:
                return false;
            default:
                return true;
        }
    }

    const validate = {
        checkEmail: checkEmail,
        checkPassword: checkPassword
    }

    return validate;
}