import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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

export const fetchMessage = createAsyncThunk(
  'messages/fetchOne',
  async (id, { rejectWithValue }) => {
    const result = await messageService.getOneMessage(id)
    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  }
)

const initialState = {
  messages: [],
  message: null
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(fetchMessage.fulfilled, (state, action) => {
        state.message = action.payload
      })
  }
})

export const selectMessages = (state) => state.messages.messages
export const selectMessage = (state) => state.messages.message
export default messagesSlice.reducer