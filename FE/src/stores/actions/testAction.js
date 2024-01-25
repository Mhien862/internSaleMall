import { createAction } from '@reduxjs/toolkit'

export const increment = createAction('test/increment')
export const decrement = createAction('test/decrement')
export const incrementByAmount = createAction('test/incrementByAmount')
// export const incrementByAmount = createAction('test/incrementByAmount',
//     function prepare(amount) {
//         return {
//             payload: amount
//         }
//     })
export const reset = createAction('test/reset')