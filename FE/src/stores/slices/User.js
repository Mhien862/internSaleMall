import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { handleGetUserInformation, handleGetAssignUser } from '../../services';

const initialState = {
    data: {},
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

export const userSlice = createSlice({
    name: 'user',
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
        setUserData: (state, action) => {
            state.data = action.payload
        },
        reset: (state) => {

        },
    },
    extraReducers(builder) {
        builder
            .addCase(handleGetUserInformation.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(handleGetUserInformation.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload.data.user
            })
            .addCase(handleGetUserInformation.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            .addCase(handleGetAssignUser.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(handleGetAssignUser.fulfilled, (state, action) => {
                const data = action.payload.data.data
                state.status = 'succeeded'
                state.data['users'] = data.users
            })
            .addCase(handleGetAssignUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export const getData = (state) => state.user.data;

export const getUsersData = (state) => state.user.data.users;

export const getStatus = (state) => state.user.status;

export const getError = (state) => state.user.error;

export const { setData, resetData, setUserData, reset } = userSlice.actions

export default userSlice.reducer