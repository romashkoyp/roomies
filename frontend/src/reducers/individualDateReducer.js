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

const initialState = {
  individualDates: [],
  individualDatesForRoom: [],
  loading: false,
  error: null,
}

const individualDateSlice = createSlice({
  name: 'individualDates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIndividualDates.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllIndividualDates.fulfilled, (state, action) => {
        state.loading = false
        state.individualDates = action.payload
      })
      .addCase(fetchAllIndividualDates.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })


      .addCase(fetchIndividualDatesForRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIndividualDatesForRoom.fulfilled, (state, action) => {
        state.loading = false
        state.individualDatesForRoom = action.payload
      })
      .addCase(fetchIndividualDatesForRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const selectIndividualDates = (state) => state.individualDates.individualDates
export const selectIndividualDatesLoading = (state) => state.individualDates.loading
export const selectIndividualDatesError = (state) => state.individualDates.error

export const selectIndividualDatesForRoom = (state) => state.individualDates.individualDatesForRoom
export const selectIndividualDatesForRoomLoading = (state) => state.individualDates.loading
export const selectIndividualDatesForRoomError = (state) => state.individualDates.error

export default individualDateSlice.reducer