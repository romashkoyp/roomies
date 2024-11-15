import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/rooms'

// Get all dates for all rooms
const getAllDates = () => apiCall('get', `${url}/dates`)

// Get all dates for desired room
const getRoomDates = (id) => apiCall('get', `${url}/${id}/dates`)

// Add new date for desired room
const addRoomDate = (id, dateData) => apiCall('post', `${url}/${id}/dates`, dateData)

// Delete desired date for desired room
const deleteRoomDate = (id, date) => apiCall('delete', `${url}/${id}/${date}`)

export default { 
  getAllDates, 
  getRoomDates, 
  addRoomDate, 
  deleteRoomDate
}