import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import individualDateService from '../services/individualDate'

// Fetch all individual dates for all rooms
export const fetchAllIndividualDates = createAsyncThunk(
  'individualDates/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await individualDateService.getAllDates()
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

// Fetch all individual dates for a specific room
export const fetchIndividualDatesForRoom = createAsyncThunk(
  'individualDates/fetchForRoom',
  async (id, { rejectWithValue }) => {
    const result = await individualDateService.getRoomDates(id)

    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

// Fetch all rooms for a specific date
// export const fetchRoomsForIndividualDate = createAsyncThunk(
//   'individualDates/fetchRoomsForDate',
//   async (date, { rejectWithValue }) => {
//     const result = await individualDateService.getRoomsForDate(date)
//     if (result.success) {
//       return result.data
//     } else {
//       return rejectWithValue(result.error)
//     }
//   }
// )

// Fetch a specific room for a specific date
export const fetchRoomForIndividualDate = createAsyncThunk(
  'individualDates/fetchRoomForDate',
  async ({ id, date }, { rejectWithValue }) => {
    const result = await individualDateService.getRoomForDate(id, date)
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  individualDates: [],
  individualDatesForRoom: [],
  currentIndividualDate: [],
  roomsForIndividualDate: [],
}

const individualDateSlice = createSlice({
  name: 'individualDates',
  initialState,
  reducers: {
    addIndividualDate(state, action) {
      return {
        ...state,
        individualDates: [...state.individualDates, action.payload],
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIndividualDates.fulfilled, (state, action) => {
        state.individualDates = action.payload
      })
      .addCase(fetchIndividualDatesForRoom.fulfilled, (state, action) => {
        state.individualDatesForRoom = action.payload
      })
      // .addCase(fetchRoomsForIndividualDate.fulfilled, (state, action) => {
      //   state.roomsForIndividualDate = action.payload
      // })
      .addCase(fetchRoomForIndividualDate.fulfilled, (state, action) => {
        state.currentIndividualDate = action.payload
      })
  },
})

export const {
  addIndividualDate,
} = individualDateSlice.actions

export const selectIndividualDates = (state) => state.individualDates.individualDates
export const selectIndividualDatesForRoom = (state) => state.individualDates.individualDatesForRoom
export const selectCurrentIndividualDate = (state) => state.individualDates.currentIndividualDate
export const selectRoomsForIndividualDate = (state) => state.individualDates.roomsForIndividualDate

export default individualDateSlice.reducer