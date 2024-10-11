import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/bookings'

const getBookingsByDate = (date) => apiCall('get', url, null, { date })

const addBooking = (bookingData) => apiCall('post', url, bookingData)

const changeBooking = (bookingData) => {
  const { id: bookingId, ...restOfData } = bookingData
  return apiCall('put', url, restOfData, { id: bookingId })
}

const deleteBooking = (id) => apiCall('delete', url, null, { id })

export default { getBookingsByDate, addBooking, changeBooking, deleteBooking }