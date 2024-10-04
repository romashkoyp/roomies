import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/settings'

const getAllWeekdays = () => apiCall('get', `${url}/weekdays`)

const updateGlobalWeekdays = (weekdaysData) => apiCall('put', `${url}/weekdays`, weekdaysData)

const updateGlobalWeekday = (formData, dayOfWeek) => apiCall('put', `${url}/weekdays/${dayOfWeek}`, formData)

const deleteWeekdays = () => apiCall('delete', `${url}/weekdays`)

const deleteWeekday = (dayOfWeek) => apiCall('delete', `${url}/weekdays/${dayOfWeek}`)

export default { getAllWeekdays, updateGlobalWeekdays, updateGlobalWeekday, deleteWeekdays, deleteWeekday }