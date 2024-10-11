import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/bookings'

const getBookingsByDate = (date) => apiCall('get', `${url}/${date}`)

const addBooking = (date) => apiCall('post', `${url}/${date}`)

const changeBooking = (date) => apiCall('put', `${url}/${date}`)

const deleteBooking = (date) => apiCall('delete', `${url}/${date}`)

export default { getBookingsByDate, addBooking, changeBooking, deleteBooking }