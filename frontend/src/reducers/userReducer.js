import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/user'

export const fetchUser = createAsyncThunk(
  'users/fetchLoggedInUser',
  async (id, { rejectWithValue }) => {
    const result = await userService.getOneUser(id)
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'users/fetchOne',
  async (id, { rejectWithValue }) => {
    const result = await userService.getOneUser(id)
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

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
  currentUser: null,
  users: []
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      setUser(state, action) {
        return {
          ...state,
          user: action.payload
        }
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.user = action.payload
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.users = action.payload
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action) => {
          state.currentUser = action.payload
        })
    },
})

export const { setUser } = userSlice.actions
export const selectUser = (state) => state.users.user
export const selectUsers = (state) => state.users.users
export const selectCurrentUser = (state) => state.users.currentUser
export default userSlice.reducer