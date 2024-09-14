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

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    setMessages(state, action) {
      return action.payload
    },
    addMessage(state, action) {
      state.push(action.payload)
    },
    updateMessage(state, action) {
      const index = state.findIndex(message => message.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
    deleteMessage(state, action) {
      return [...state.filter(message => message.id !== action.payload)]
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      return action.payload
    })
  }
})

export const { setMessages, addMessage, updateMessage, deleteMessage } = messagesSlice.actions
export const selectMessages = (state) => state.messages
export default messagesSlice.reducer