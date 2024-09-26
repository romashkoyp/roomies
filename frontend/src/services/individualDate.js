import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/rooms'

// Get all dates for all rooms
const getAllDates = () => apiCall('get', `${url}/dates`)

// Delete all dates for all rooms
const deleteAllDates = () => apiCall('delete', `${url}/dates`)

// Get all dates for desired room
const getRoomDates = (id) => apiCall('get', `${url}/${id}/dates`)

// Get all rooms for desired date
const getRoomsForDate = (date) => apiCall('get', `${url}/${date}`)

// Add new date for desired room
const addRoomDate = (id, dateData) => apiCall('post', `${url}/${id}/dates`, dateData)

// Delete all dates for desired room
const deleteRoomDates = (id) => apiCall('delete', `${url}/${id}/dates`)

// Get desired room for desired date
const getRoomForDate = (id, date) => apiCall('get', `${url}/${id}/${date}`)

// Delete desired date for desired room
const deleteRoomDate = (id, date) => apiCall('delete', `${url}/${id}/${date}`)

export default { 
  getAllDates, 
  deleteAllDates,
  getRoomDates, 
  getRoomsForDate, 
  addRoomDate, 
  deleteRoomDates, 
  getRoomForDate, 
  deleteRoomDate
}