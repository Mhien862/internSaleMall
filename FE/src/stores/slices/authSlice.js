import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { handleGetUserAccount } from '../../services'

const initialState = {
    data: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    accessToken: null,
    isLogin: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.data = action.payload.user
            state.accessToken = action.payload.accessToken
            delete state.data.message
            state.isLogin = true
        },
        logout: (state) => {
            state.data = null
            state.accessToken = null
            state.isLogin = false
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
            state.isLogin = true
        },
        setData: (state, action) => {
            state.data = action.payload
        },
    },
    extraReducers(builder) {
        builder
            .addCase(handleGetUserAccount.pending, (state, action) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(handleGetUserAccount.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload.data.user
            })
            .addCase(handleGetUserAccount.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export const getAccessToken = (state) => state.auth.accessToken;

export const getUser = (state) => state.auth.data;

export const isLogin = (state) => state.auth.isLogin;

export const getError = (state) => state.auth.error;

export const getStatus = (state) => state.auth.status;

export const { login, logout, setAccessToken, setData } = authSlice.actions

export default authSlice.reducer