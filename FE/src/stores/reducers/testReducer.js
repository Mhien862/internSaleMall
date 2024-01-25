import { createReducer } from '@reduxjs/toolkit'
import { increment, decrement, incrementByAmount, reset } from "../actions/testAction"

const initialState = {
    value: 0,
}

export const testReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(increment, (state, action) => {
            state.value += 1
        })
        .addCase(decrement, (state, action) => {
            state.value -= 1
        })
        .addCase(incrementByAmount, (state, action) => {
            state.value += action.payload
        })
        .addCase(reset, (state, action) => {
            state.value = 0
        })
})

export const selectTest = (state) => state.test;

export default testReducer