import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  timeoutId: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationToShow(state, action) {
        const { message, type, timeoutId } = action.payload
        state.message = message
        state.type = type
        state.timeoutId = timeoutId
    },
    notificationToHide(state) {
        state.message = ''
        state.type = null
        state.timeoutId = null
    }
  }
})

export const { notificationToShow, notificationToHide } = notificationSlice.actions

export const setNotification = (message, type, duration) => {
    return async dispatch => {
        const timeoutId = setTimeout(() => {
            dispatch(notificationToHide())
        }, duration * 1000)
        dispatch(notificationToShow({ message, type, timeoutId }))
    }
}

export default notificationSlice.reducer