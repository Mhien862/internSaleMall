import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: 0,
}

export const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        },
        reset: (state) => {
            state.value = 0
        },
    },
})

export const selectTest = (state) => state.test;

export const { increment, decrement, incrementByAmount, reset } = testSlice.actions

export default testSlice.reducer