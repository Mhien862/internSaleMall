import { createSlice } from '@reduxjs/toolkit'
import { handleGetAllUser, handleGetAllCourses } from '../../services';

const initialState = {
    data: {},
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const PendingAPI = (state, action) => {
    state.status = 'loading'
    state.error = null
}

const RejectedAPI = (state, action) => {
    state.status = 'failed'
    state.error = action.error.message
}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setData: (state, action) => {
            let name = action.payload.name
            let value = action.payload.value
            state.data[name] = value
        },
        resetData: (state) => {
            state.data = {}
        },
        reset: (state) => {

        },
    },
    extraReducers(builder) {
        builder
            .addCase(handleGetAllUser.pending, PendingAPI)
            .addCase(handleGetAllUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload.data
            })
            .addCase(handleGetAllUser.rejected, RejectedAPI)

            .addCase(handleGetAllCourses.pending, PendingAPI)
            .addCase(handleGetAllCourses.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload.data
            })
            .addCase(handleGetAllCourses.rejected, RejectedAPI)
    },
})

export const getDataUser = (state) => state.table.data.users;

export const getDataCourses = (state) => state.table.data.courses;

export const getStatusTable = (state) => state.table.status;

export const getError = (state) => state.table.error;

export const { setData, resetData, reset } = tableSlice.actions

export default tableSlice.reducer