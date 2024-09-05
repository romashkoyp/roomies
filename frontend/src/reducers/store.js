import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer'
import notificationReducer from './notificationReducer'
import messageReducer from './messageReducer'

const store = configureStore({
    reducer: {
      user: userReducer,
      notification: notificationReducer,
      messages: messageReducer
    }
  })

export default store