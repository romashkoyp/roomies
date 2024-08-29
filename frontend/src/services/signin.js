import axios from 'axios'
import BASE_URL from './config'
const url = BASE_URL + '/signin'

let token = null

const setToken = (newToken) => {
  token = newToken
  axios.defaults.headers.common.Authorization = `bearer ${token}`
}

const signin = async (credentials) => {
  try {
    const res = await axios.post(url, credentials)
    setToken(res.data.token)
  return res.data
  } catch (error) {
    console.error('Signin error:', error)
    return null
  }
}

export default { setToken, signin }