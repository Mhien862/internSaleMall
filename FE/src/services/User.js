import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const handleGetAllUser = async ({ email, role }) => {
//     let res = ''
//     try {
//         res = await axios.get(`http://localhost:8080/all-users?email=${email}&role=${role}`);
//         return res
//     } catch (error) {
//         let err = error.response
//         if (err) {
//             res = {
//                 status: err.status,
//                 data: { message: err.data }
//             }
//         } else {
//             res = {
//                 status: 503,
//                 data: { message: `That's an error. Cannot connect to server` }
//             }
//         }
//         return res
//     }
// };

const handleGetAllUser = createAsyncThunk('table/get-all-users', async (data) => {
    let res = ''
    try {
        res = await axios.get(`http://localhost:8080/all-users?email=${data.email}&role=${data.role}`);
        return res
    } catch (error) {
        let err = error.response
        if (err) {
            throw ({ message: err.data.message });
        } else {
            throw ({ message: `That's an error. Cannot connect to server` });
        }
    }
})

const handleGetAssignUser = createAsyncThunk('user/get-all-users', async (data) => {
    let res = ''
    try {
        res = await axios.get(`http://localhost:8080/all-assign?${data}`);
        return res
    } catch (error) {
        let err = error.response
        if (err) {
            throw ({ message: err.data.message });
        } else {
            throw ({ message: `That's an error. Cannot connect to server` });
        }
    }
})

// const handleGetUserInformation = async (id) => {
//     let res = ''
//     try {
//         res = await axios.get(`http://localhost:8080/user-information?id=${id}`);
//         return res
//     } catch (error) {
//         let err = error.response
//         if (err) {
//             res = {
//                 status: err.status,
//                 data: { message: err.data }
//             }
//         } else {
//             res = {
//                 status: 503,
//                 data: { message: `That's an error. Cannot connect to server` }
//             }
//         }
//         return res
//     }
// };

const handleGetUserInformation = createAsyncThunk('user/user-information', async (id) => {
    let res = ''
    try {
        res = await axios.get(`http://localhost:8080/user-information?id=${id}`);
        return res
    } catch (error) {
        let err = error.response
        if (err) {
            throw ({ message: err.data.message });
        } else {
            throw ({ message: `That's an error. Cannot connect to server` });
        }
    }
})

const handleNewUserApi = async (data) => {
    let res = ''
    try {
        res = await axios.post('http://localhost:8080/create-new-user',
            data
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
        throw res.data
    }
}

const handleEditUserApi = async (data) => {
    let res = ''
    try {
        res = await axios.put('http://localhost:8080/edit-user',
            data
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

const handleChangePasswordApi = async (data) => {
    let res = ''
    try {
        res = await axios.put('http://localhost:8080/change-password',
            data
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

const handleChangeStatusApi = async (data) => {
    let res = ''
    try {
        res = await axios.put('http://localhost:8080/change-status-account',
            data
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

export { handleGetAllUser, handleGetAssignUser, handleNewUserApi, handleEditUserApi, handleChangePasswordApi, handleChangeStatusApi, handleGetUserInformation }
