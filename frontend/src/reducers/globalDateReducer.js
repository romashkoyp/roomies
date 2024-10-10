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
  globalDates: []
}

const globalDateSlice = createSlice({
  name: 'globalDates',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalDates.fulfilled, (state, action) => {
        state.globalDates = action.payload
      })
  }
})

export const selectGlobalDates = (state) => state.globalDates.globalDates
export default globalDateSlice.reducer