import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  password: '',
  user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    setUsername(state, action) { state.username = action.payload },
    setPassword(state, action) { state.password = action.payload },
    setUser(state, action) { state.user = action.payload }
    }
})

export const { setUsername, setPassword, setUser } = userSlice.actions
export const selectUsername = (state) => state.user.username
export const selectPassword = (state) => state.user.password
export const selectUser = (state) => state.user.user

export default userSlice.reducer