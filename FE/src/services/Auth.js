import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import useService from './Service';

const handleLoginApi = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:8080/Auth/login', {
            email: email,
            password: password
        }, { withCredentials: true });

        return response;
    } catch (error) {
        console.log(error)
        throw error.response ? error.response.data : 'Cannot connect to server';
    }
};

const handleLogoutApi = async () => {
    try {
        const response = await axios.post('http://localhost:8080/Auth/logout', {}, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        let err = error.response
        if (err) {
            return {
                status: err.status,
                data: { message: err.data }
            }
        } else {
            return {
                status: 503,
                data: { message: `That's an error. Cannot connect to server` }
            }
        }
    }
};


const refreshTokenApi = async () => {
    let res = ''
    try {
        res = await axios.get('http://localhost:8080/Auth/refreshToken', {
            withCredentials: true
        })
        return res
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Cannot connect to server' };
    }
}

export const refreshTokenRedux = createAsyncThunk('auth/refreshToken', async () => {
    const response = await axios.get('http://localhost:8080/Auth/refreshToken', {
        withCredentials: true
    });
    return response.data;
});


const forgotPasswordApi = async (email) => {
    let res = ''
    try {
        res = await axios.post('http://localhost:8080/Auth/forgot-password', {
            email: email,
            host: '127.0.0.1:5173'
        }
        );
        return res
    } catch (error) {
        let err = error.response
        if (err) {
            res = {
                status: err.status,
                data: { message: err.data }
            }
        } else {
            res = {
                status: 503,
                data: { message: `That's an error. Cannot connect to server` }
            }
        }
        return res
    }
}

const resetPasswordApi = async (token, password, rePassword) => {
    let res = ''
    try {
        res = await axios.post('http://localhost:8080/Auth/reset-password', {
            passwordResetToken: token,
            password: password,
            rePassword: rePassword
        });
        return res
    } catch (error) {
        let err = error.response
        if (err) {
            res = {
                status: err.status,
                data: { message: err.data }
            }
        } else {
            res = {
                status: 503,
                data: { message: `That's an error. Cannot connect to server` }
            }
        }
        return res
    }
}

const handleGetUserAccount = createAsyncThunk('auth/user-account', async (dispatch) => {
    try {
        const response = await useService(dispatch).get('/Auth/account')
        return response;
    } catch (error) {
        console.log(error)
        throw error.response ? error.response.data : 'Cannot connect to server';
    }
});
export {
    handleLoginApi,
    handleLogoutApi,
    refreshTokenApi,
    forgotPasswordApi,
    resetPasswordApi,
    handleGetUserAccount
}