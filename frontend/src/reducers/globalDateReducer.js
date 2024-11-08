import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import globalDateService from '../services/globalDate'

export const fetchGlobalDates = createAsyncThunk(
  'globalDates/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await globalDateService.getAllGlobalDates()
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  globalDates: [],
  loading: false,
  error: null
}

const globalDateSlice = createSlice({
  name: 'globalDates',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalDates.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGlobalDates.fulfilled, (state, action) => {
        state.loading = false
        state.globalDates = action.payload
      })
      .addCase(fetchGlobalDates.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const selectGlobalDates = (state) => state.globalDates.globalDates
export const selectGlobalDatesLoading = (state) => state.globalDates.loading
export const selectGlobalDatesError = (state) => state.globalDates.error
export default globalDateSlice.reducer