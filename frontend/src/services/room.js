import axios from 'axios'
import BASE_URL from './config'
const url = BASE_URL + '/rooms'

const getAllRooms = async () => {
  try {
    const res = await axios.get(url)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'No rooms found'
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

const getOneRoom = async (id) => {
  try {
    const res = await axios.get(`${url}/${id}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'No room found'
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

const addRoom = async (credentials) => {
  try {
    const res = await axios.post(url, credentials)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Add room error:', error)
    let errorMessage = 'Add room failed'
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

const updateRoom = async (id, name, capacity, size, imagePath) => {
  try {
    const res = await axios.put(`${url}/${id}`, { name, capacity, size, imagePath })
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'Updating of room failed'
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

const deleteRoom = async (id) => {
  try {
    const res = await axios.delete(`${url}/${id}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'Deletion of room failed'
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

export default { getAllRooms, getOneRoom, addRoom, updateRoom, deleteRoom }