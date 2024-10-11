import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
  rooms: []
}

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.rooms = action.payload
      })
  }
})

export const selectRooms = (state) => state.rooms.rooms
export default roomSlice.reducer