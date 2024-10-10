import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer'
import notificationReducer from './notificationReducer'
import messageReducer from './messageReducer'
import roomReducer from './roomReducer'
import individualDateReducer from './individualDateReducer'
import weekdayReducer from './weekdayReducer'
import globalDateReducer from './globalDateReducer'

const store = configureStore({
    reducer: {
      users: userReducer,
      notification: notificationReducer,
      messages: messageReducer,
      rooms: roomReducer,
      individualDates: individualDateReducer,
      weekdays: weekdayReducer,
      globalDates: globalDateReducer
    }
  })

export default store