import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'

import roomService from '../services/room'

export const fetchRooms = createAsyncThunk(
  'rooms/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await roomService.getAllRooms()
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  rooms: [],
  loading: false,
  error: null
}

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false
        state.rooms = action.payload
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const selectRooms = (state) => state.rooms.rooms
export const selectRoomsLoading = (state) => state.rooms.loading
export const selectRoomsError = (state) => state.rooms.error
export default roomSlice.reducer