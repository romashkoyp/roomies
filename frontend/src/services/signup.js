import axios from 'axios'
import BASE_URL from './config'
const url = BASE_URL + '/signup'

const signup = async (credentials) => {
  try {
    const res = await axios.post(url, credentials)
    return { success: true, data: res.data }
  } catch (error) {
    console.error('Signup error:', error)
    let errorMessage = 'Sign up failed'
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

export default { signup }