import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/users'

const getAllUsers = () => apiCall('get', url)

const getOneUser = (id) => apiCall('get', `${url}/${id}`)

const updateUser = (id, username, name, admin, enabled) => 
  apiCall('put', `${url}/${id}`, { username, name, admin, enabled })

const deleteUser = (id) => apiCall('delete', `${url}/${id}`)

export default { getAllUsers, getOneUser, updateUser, deleteUser }