import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const handleGetAllCourses = createAsyncThunk('courses/get-all-courses', async (data) => {
    let res = ''
    try {
        res = await axios.get(`http://localhost:8080/all-courses?name=${data.name}&status=${data.status}`);
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

const handleCreateCourses = createAsyncThunk('courses/create-new-courses', async (data) => {
    let res = ''
    try {
        res = await axios.post(`http://localhost:8080/create-new-courses`, data);
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

const handleChangeStatusCourses = createAsyncThunk('courses/change-status-courses', async (data) => {
    let res = ''
    try {
        res = await axios.put(`http://localhost:8080/change-status-courses`, data);
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

const handleGetUserCourses = createAsyncThunk('courses/all-user-courses', async (data) => {
    let res = ''
    try {
        res = await axios.get(`http://localhost:8080/all-user-courses?course_id=${data.course_id}&position=${data.position}`);
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

const handleAddUserCourses = createAsyncThunk('courses/add-user-courses', async (data) => {
    let res = ''
    try {
        res = await axios.put(`http://localhost:8080/add-new-user-courses`, data);
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

const handleRemoveUserCourses = createAsyncThunk('courses/remove-user-courses', async (data) => {
    let res = ''
    try {
        res = await axios.delete(`http://localhost:8080/remove-user-courses?id=${data.id}`);
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

const handleGetCourses = createAsyncThunk('courses/get-courses', async (data) => {
    let res = ''
    try {
        data.detail ?
            res = await axios.get(`http://localhost:8080/get-courses?id=${data.course_id}&detail=${data.detail}`)
            :
            res = await axios.get(`http://localhost:8080/get-courses?id=${data.course_id}`);
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

const handleEditCourses = createAsyncThunk('courses/edit-courses', async (data) => {
    let res = ''
    try {
        res = await axios.put(`http://localhost:8080/edit-courses`, data);
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

const handleGetSchedule = createAsyncThunk('courses/get-schedule', async (data) => {
    let res = ''
    try {
        res = await axios.get(`http://localhost:8080/get-schedule?course_id=${data.course_id}`);
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

const handleEditSchedule = createAsyncThunk('courses/edit-schedule', async (data) => {
    let res = ''
    try {
        res = await axios.put(`http://localhost:8080/edit-schedule`, data);
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

export {
    handleGetAllCourses,
    handleCreateCourses,
    handleChangeStatusCourses,
    handleGetUserCourses,
    handleAddUserCourses,
    handleRemoveUserCourses,
    handleGetCourses,
    handleEditCourses,
    handleGetSchedule,
    handleEditSchedule,
}