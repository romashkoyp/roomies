import axios from 'axios'
const baseUrl = 'http://localhost:4000/api/signin'

let token = null

const setToken = (newToken) => {
  token = newToken
  axios.defaults.headers.common.Authorization = `bearer ${token}`
}

const signin = async (credentials) => {
  try {
    const res = await axios.post(baseUrl, credentials)
    setToken(res.data.token)
  return res.data
  } catch (error) {
    console.error('Signin error:', error)
    return null
  }
}

export default { setToken, signin }