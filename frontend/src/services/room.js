import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/rooms'

const getAllRooms = () => apiCall('get', url)

const getOneRoom = (id) => apiCall('get', `${url}/${id}`)

const addRoom = (credentials) => apiCall('post', url, credentials)

const updateRoom = (id, name, capacity, size, image_path) => 
  apiCall('put', `${url}/${id}`, { name, capacity, size, image_path })

const deleteRoom = (id) => apiCall('delete', `${url}/${id}`)

export default { getAllRooms, getOneRoom, addRoom, updateRoom, deleteRoom }