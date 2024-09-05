import axios from 'axios'
import BASE_URL from './config'
const url = BASE_URL + '/notifications'

const postMessage = async (credentials) => {
  try {
    const res = await axios.post(url, credentials)
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

export default { postMessage, getAllMessages }