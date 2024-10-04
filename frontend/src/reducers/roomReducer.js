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

export const fetchRoom = createAsyncThunk(
  'rooms/fetchOne',
  async (id, { rejectWithValue }) => {
    const result = await roomService.getOneRoom(id)
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  rooms: [],
  currentRoom: null
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
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.currentRoom = action.payload
      })
  }
})

export const selectRooms = (state) => state.rooms.rooms
export const selectCurrentRoom = (state) => state.rooms.currentRoom
export default roomSlice.reducer