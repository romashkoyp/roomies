import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'

import messageService from '../services/message'

export const fetchMessages = createAsyncThunk(
  'messages/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await messageService.getAllMessages()
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  messages: [],
  loading: false,
  error: null
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const selectMessages = (state) => state.messages.messages
export const selectMessagesLoading = (state) => state.messages.loading
export const selectMessagesError = (state) => state.messages.error
export default messagesSlice.reducer