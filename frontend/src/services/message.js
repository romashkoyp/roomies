import { apiCall } from './apiUtils'
import BASE_URL from './config'

const url = BASE_URL + '/notifications'

const getAllMessages = () => apiCall('get', url)

const postMessage = (content) => apiCall('post', url, content)

const updateMessage = (id, content) => apiCall('put', `${url}/${id}`, { content })

const deleteMessage = (id) => apiCall('delete', `${url}/${id}`)

export default { getAllMessages, postMessage, updateMessage, deleteMessage }