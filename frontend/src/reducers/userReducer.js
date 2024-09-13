import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/user'

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await userService.getAllUsers()
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  user: null,
  users: []
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      setUser(state, action) {
        state.user = action.payload
      },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
    }
})

export const { setUser } = userSlice.actions
export const selectUser = (state) => state.users.user
export const selectUsers = (state) => state.users.users
export default userSlice.reducer