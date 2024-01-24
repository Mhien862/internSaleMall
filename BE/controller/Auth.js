import authBLLs from '../BLL/Auth';
require("dotenv").config();

const handleLogin = async (req, res) => {
    let { email, password } = req.body;
    let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !password) {
        return res.status(406).send({
            message: `Missing your parameter`,
        })
    }

    let data = await authBLLs.handleLoginBLL(req.body)

    if (data.errCode === 1) return res.status(500).send(data.message)

    if (data.errCode !== 0) return res.status(401).send(data.message)

    res.cookie('refresh_token', data.refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({
        message: data.message,
        user: data.user || {},
        accessToken: data.accessToken
    })
}

const handleLogout = (req, res) => {
    const cookies = req.cookies

    if (!cookies.refresh_token) return res.sendStatus(204)

    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'Lax', secure: true })
    res.status(200).json({ message: 'Logout successfully' })
}

const refreshToken = async (req, res) => {
    const cookies = req.cookies

    if (!cookies.refresh_token) return res.status(401).send('Unauthorized')

    const refreshToken = cookies.refresh_token
    let data = await authBLLs.refreshToken(refreshToken)

    if (data.errCode === 1) return res.status(500).send(data.message)

    if (data.errCode !== 0) return res.status(401).send('Unauthorized')

    return res.status(200).json({
        message: data.message,
        accessToken: data.accessToken
    })
}

const forgotPassword = async (req, res) => {
    let email = req.body.email;
    let host = req.body.host;

    if (!email || !host) {
        return res.status(406).json({
            message: `Missing your parameter`,
        })
    }
    let data = await authBLLs.forgotPassword(req.body);

    if (data.errCode === 1) return res.status(500).send(data.message)

    if (data.errCode !== 0) return res.status(401).send(data.message)

    return res.status(200).json({
        message: data.message,
    });
};

const resetPassword = async (req, res) => {
    let resetPasswordToken = req.body.passwordResetToken;
    let password = req.body.password;
    let rePassword = req.body.rePassword;

    if (!resetPasswordToken || !password || !rePassword) {
        return res.status(406).send({
            message: `Missing your parameter`,
        })
    }

    let data = await authBLLs.resetPassword(req.body);

    if (data.errCode === 1) return res.status(500).send(data.message)

    if (data.errCode !== 0) return res.status(401).send(data.message)

    return res.status(200).json({
        message: data.message,
    });
};

const getAccount = async (req, res) => {
    const user = req.user

    if (!user) return res.status(401).send('Unauthorized')

    let data = await authBLLs.getAccount(user)

    if (data.errCode === 1) return res.status(500).send(data.message)

    if (data.errCode !== 0) return res.status(401).send('Unauthorized')

    return res.status(200).json({
        message: data.message,
        user: data ? data.user : {}
    })
}

module.exports = {
    handleLogin,
    handleLogout,
    refreshToken,
    forgotPassword,
    resetPassword,
    getAccount
}