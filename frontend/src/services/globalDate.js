import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/settings/dates'

// Get all global dates for all rooms
const getAllGlobalDates = () => apiCall('get', url)

// Create new global date
const addGlobalDate = (credentials) => apiCall('post', url, credentials)

// Delete all global dates
const deleteAllGlobalDates = () => apiCall('delete', url)

// Get one date
const getOneDate = (date) => apiCall('get', `${url}/${date}`)

// Delete one date
const deleteGlobalDate = (date) => apiCall('delete', `${url}/${date}`)

export default { 
  getAllGlobalDates,
  addGlobalDate,
  deleteAllGlobalDates,
  getOneDate,
  deleteGlobalDate,
}