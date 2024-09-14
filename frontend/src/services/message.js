import axios from 'axios'
import BASE_URL from './config'
const url = BASE_URL + '/notifications'

const getAllMessages = async () => {
  try {
    const res = await axios.get(url)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'No messages found'
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      errorMessage = error.response.data.errors[0].msg
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    return { 
      success: false, 
      error: errorMessage
    }
  }
}

const postMessage = async (content) => {
  try {
    const res = await axios.post(url, content)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'Creation of message failed'
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      errorMessage = error.response.data.errors[0].msg
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    return { 
      success: false, 
      error: errorMessage
    }
  }
}

const updateMessage = async (id, content) => {
  try {
    const res = await axios.put(`${url}/${id}`, { content })
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'Updating of message failed'
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      errorMessage = error.response.data.errors[0].msg
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    return { 
      success: false, 
      error: errorMessage
    }
  }
}

const deleteMessage = async (id) => {
  try {
    const res = await axios.delete(`${url}/${id}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'Deletion of message failed'
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      errorMessage = error.response.data.errors[0].msg
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    return { 
      success: false, 
      error: errorMessage
    }
  }
}

export default { postMessage, getAllMessages, updateMessage, deleteMessage }