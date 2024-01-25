import { createSlice } from '@reduxjs/toolkit'
import {
    handleGetUserCourses,
    handleGetCourses,
    handleAddUserCourses,
    handleCreateCourses,
    handleEditCourses,
    handleEditSchedule,
    handleChangeStatusCourses
} from '../../services'

const initialState = {
    data: {},
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    message: null,
}

const initLessons = {
    date: null,
    duration: null,
    name: "",
    trainer: null,
}

const initCategory = {
    name_categories: "",
    lessons: [
        initLessons
    ],
}

const PendingAPI = (state, action) => {
    state.status = 'loading'
    state.error = null
    state.message = null
}

const RejectedAPI = (state, action) => {
    state.status = 'failed'
    state.error = action.error.message
}

export const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        resetData: (state) => {
            state.data = {}
        },
        setCoursesData: (state, action) => {
            state.data["courses"] = action.payload
        },
        setCoursesId: (state, action) => {
            state.data["course_id"] = action.payload
        },
        removeUsers: (state, action) => {
            let users = state.data["users"].filter((item, index) => index !== action.payload)
            state.data["users"] = users
        },
        addUsers: (state, action) => {
            state.data["users"].push(action.payload)
        },
        addSchedule: (state, action) => {
            let lessons = 0
            action.payload.map(item => lessons = item.lessons.length + lessons)
            state.data["lessons"] = lessons
            state.data["schedule"] = action.payload
        },
    },
    extraReducers(builder) {
        builder
            .addCase(handleGetUserCourses.pending, PendingAPI)
            .addCase(handleGetUserCourses.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data["users"] = action.payload.data.users
            })
            .addCase(handleGetUserCourses.rejected, RejectedAPI)

            .addCase(handleAddUserCourses.pending, PendingAPI)
            .addCase(handleAddUserCourses.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.message = action.payload.data
            })
            .addCase(handleAddUserCourses.rejected, RejectedAPI)

            .addCase(handleCreateCourses.pending, PendingAPI)
            .addCase(handleCreateCourses.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.message = action.payload.data
            })
            .addCase(handleCreateCourses.rejected, RejectedAPI)

            .addCase(handleEditCourses.pending, PendingAPI)
            .addCase(handleEditCourses.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.message = action.payload.data
            })
            .addCase(handleEditCourses.rejected, RejectedAPI)

            .addCase(handleGetCourses.pending, PendingAPI)
            .addCase(handleGetCourses.fulfilled, (state, action) => {
                let data = action.payload.data.data
                state.status = 'succeeded'
                state.data = data
                if (data.courses) {
                    state.data['courses']["course_id"] = data.courses.id
                    state.data['courses']["name_courses"] = data.courses.name
                    state.data["lessons"] = data.courses.lessons ? data.courses.lessons : 0
                }
            })
            .addCase(handleGetCourses.rejected, RejectedAPI)

            .addCase(handleEditSchedule.pending, PendingAPI)
            .addCase(handleEditSchedule.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.message = action.payload.data
            })
            .addCase(handleEditSchedule.rejected, RejectedAPI)

            .addCase(handleChangeStatusCourses.pending, PendingAPI)
            .addCase(handleChangeStatusCourses.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.message = action.payload.data
            })
            .addCase(handleChangeStatusCourses.rejected, RejectedAPI)
    },
})

export const getDataUsers = (state) => state.courses.data.users;

export const getCoursesId = (state) => state.courses.data.course_id;

export const getLengthLessons = (state) => state.courses.data.lessons;

export const getSchedule = (state) => state.courses.data.schedule;

export const getCoursesData = (state) => state.courses.data.courses;

export const getStatus = (state) => state.courses.status;

export const getError = (state) => state.courses.error;

export const getMessage = (state) => state.courses.message;

export const {
    resetData,
    setCoursesId,
    removeUsers,
    addUsers,
    addSchedule,
    setCoursesData,
} = coursesSlice.actions

export default coursesSlice.reducer