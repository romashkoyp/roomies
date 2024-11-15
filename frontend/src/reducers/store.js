import { configureStore } from '@reduxjs/toolkit'

import bookingReducer from './bookingReducer'
import globalDateReducer from './globalDateReducer'
import individualDateReducer from './individualDateReducer'
import messageReducer from './messageReducer'
import notificationReducer from './notificationReducer'
import roomReducer from './roomReducer'
import userReducer from './userReducer'
import weekdayReducer from './weekdayReducer'

const store = configureStore({
    reducer: {
      users: userReducer,
      notification: notificationReducer,
      messages: messageReducer,
      rooms: roomReducer,
      individualDates: individualDateReducer,
      weekdays: weekdayReducer,
      globalDates: globalDateReducer,
      bookings: bookingReducer
    }
  })

export default store