import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/settings/dates'

// Get all global dates for all rooms
const getAllGlobalDates = () => apiCall('get', url)

// Create new global date
const addGlobalDate = (credentials) => apiCall('post', url, credentials)

// Delete one date
const deleteGlobalDate = (date) => apiCall('delete', `${url}/${date}`)

export default { 
  getAllGlobalDates,
  addGlobalDate,
  deleteGlobalDate,
}