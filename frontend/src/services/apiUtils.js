import axios from 'axios'

export const handleError = (error, defaultMessage) => {
  console.error('API error:', error)
  let errorMessage = defaultMessage
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

export const apiCall = async (method, endpoint, data = null, queryParams = {}) => {
  try {
    const config = {
      method,
      url: endpoint,
      data,
      params: queryParams
    }
    const res = await axios(config)
    return { success: true, data: res.data }
  } catch (error) {
    return handleError(error, 'API call failed')
  }
}