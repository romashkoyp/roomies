import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import weekdaysService from '../services/weekday'

export const fetchWeekdays = createAsyncThunk(
  'weekdays/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await weekdaysService.getAllWeekdays()
    if (result.success) {
      return result.data.sort((a, b) => {
        const dayA = a.dayOfWeek
        const dayB = b.dayOfWeek
        if (dayA === 0) return 1
        if (dayB === 0) return -1
        return dayA - dayB
      })
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  weekdays: [],
  currentWeekday: [],
  loading: false,
  error: null
}

const weekdaySlice = createSlice({
  name: 'weekdays',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeekdays.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeekdays.fulfilled, (state, action) => {
        state.loading = false
        state.weekdays = action.payload
      })
      .addCase(fetchWeekdays.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const selectWeekdays = (state) => state.weekdays.weekdays
export const selectWeekdaysLoading = (state) => state.weekdays.loading
export const selectWeekdaysError = (state) => state.weekdays.error
export default weekdaySlice.reducer