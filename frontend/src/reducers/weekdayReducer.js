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
  currentWeekday: []
}

const weekdaySlice = createSlice({
  name: 'weekdays',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeekdays.fulfilled, (state, action) => {
        state.weekdays = action.payload
      })
  }
})

export const selectWeekdays = (state) => state.weekdays.weekdays
export default weekdaySlice.reducer

