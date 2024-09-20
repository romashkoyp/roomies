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

export const fetchUser = createAsyncThunk(
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

const initialState = {
  user: null,
  users: [],
  currentUser: null
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
      addUser(state, action) {
        return {
          ...state,
          users: [...state.users, action.payload]
        }
      },
      updateUser(state, action) {
        return {
          ...state,
          users: state.users.map(user =>
            user.id === action.payload.id ? action.payload : user
          )
        }
      },
      setCurrentUser(state, action) {
        return {
          ...state,
          currentUser: action.payload
        }
      },
      deleteUser(state, action) {
        return {
          ...state,
          users: state.users.filter(user => user.id !== action.payload),
        } 
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.users = action.payload
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.currentUser = action.payload
      })
    },
})

export const { setUser, updateUser, addUser, deleteUser, setCurrentUser } = userSlice.actions
export const selectUser = (state) => state.users.user
export const selectUsers = (state) => state.users.users
export const selectCurrentUser = (state) => state.users.currentUser
export default userSlice.reducer