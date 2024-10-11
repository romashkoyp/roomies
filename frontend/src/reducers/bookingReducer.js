import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import bookingService from '../services/booking'

export const fetchBookingsByDate = createAsyncThunk(
  'rooms/fetchBookingsByDate',
  async (date, { rejectWithValue }) => {
    const result = await bookingService.getBookingsByDate(date)
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  bookings: []
}

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsByDate.fulfilled, (state, action) => {
        state.bookings = action.payload
      })
  }
})

export const selectBookings = (state) => state.bookings.bookings
export default bookingSlice.reducer