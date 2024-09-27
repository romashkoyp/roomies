import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/settings'

const getAllWeekdays = () => apiCall('get', `${url}/weekdays`)

const getWeekday = () => apiCall('get', `${url}/weekdays/:dayOfWeek`)

const updateGlobalWeekdays = (weekdaysData) => apiCall('put', `${url}/weekdays`, weekdaysData)

const deleteWeekdays = () => apiCall('delete', `${url}/weekdays`)

export default { getAllWeekdays, getWeekday, updateGlobalWeekdays, deleteWeekdays }