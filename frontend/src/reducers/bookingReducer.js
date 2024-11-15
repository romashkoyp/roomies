import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'

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
  bookings: [],
  loading: false,
  error: null
}

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsByDate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookingsByDate.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookingsByDate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const selectBookings = (state) => state.bookings.bookings
export const selectBookingsLoading = (state) => state.bookings.loading
export const selectBookingsError = (state) => state.bookings.error
export default bookingSlice.reducer