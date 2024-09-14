import axios from 'axios'
import BASE_URL from './config'
const url = BASE_URL + '/users'

const getAllUsers = async () => {
  try {
    const res = await axios.get(url)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'No users found'
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

const getOneUser = async (id) => {
  try {
    const res = await axios.get(`${url}/${id}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'No user found'
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

const updateUser = async (id, username, name, admin, enabled) => {
  try {
    const res = await axios.put(`${url}/${id}`, {username, name, admin, enabled })
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'Updating of user failed'
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

const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${url}/${id}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Message error:', error)
    let errorMessage = 'Deletion of user failed'
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

export default { getAllUsers, getOneUser, updateUser, deleteUser }