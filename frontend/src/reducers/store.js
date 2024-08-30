import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer'
import notificationReducer from './notificationReducer'

const store = configureStore({
    reducer: {
      user: userReducer,
      notification: notificationReducer
    }
  })

export default store