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
  reducers: {
    addRoom(state, action) {
      return {
        ...state,
        rooms: [...state.rooms, action.payload]
      }
    },
    setCurrentRoom(state, action) {
      return {
        ...state,
        currentRoom: action.payload
      }
    },
    updateRoom(state, action) {
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.id ? action.payload : room
        )
      }
    },
    deleteRoom(state, action) {
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
      } 
    },
  },
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

export const { addRoom, setCurrentRoom, deleteRoom, updateRoom } = roomSlice.actions
export const selectRooms = (state) => state.rooms.rooms
export const selectCurrentRoom = (state) => state.rooms.currentRoom
export default roomSlice.reducer