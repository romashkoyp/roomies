import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/signup'

const signup = (credentials) => apiCall('post', url, credentials)

export default { signup }