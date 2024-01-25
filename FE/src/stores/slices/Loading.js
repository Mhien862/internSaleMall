import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open: false
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload
        },
    },
})

export const getOpen = (state) => state.loading.open;

export const { setOpen } = loadingSlice.actions

export default loadingSlice.reducer