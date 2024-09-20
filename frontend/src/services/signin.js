import { apiCall } from './apiUtils'
import axios from 'axios'
import BASE_URL from './config'

const url = BASE_URL + '/signin'

let token = null

const setToken = (newToken) => {
  token = newToken
  axios.defaults.headers.common.Authorization = `bearer ${token}`
}

const signin = async (credentials) => {
  const result = await apiCall('post', url, credentials)
  if (result.success) {
    setToken(result.data.token)
  }
  return result
}

export default { setToken, signin }