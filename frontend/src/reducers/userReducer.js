import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    setUser(state, action) {
      return action.payload
    },
        setUsername(state, action) {
      return { ...state, username: action.payload }
        },
        setPassword(state, action) {
      return { ...state, password: action.payload }
        },
    }
})

export const { setUser, setUsername, setPassword } = userSlice.actions

export const selectUser = (state) => state.user

export const selectUsername = (state) => state.user ? state.user.username : ''

export const selectPassword = (state) => state.user ? state.user.password : ''

export default userSlice.reducer