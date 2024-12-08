// eslint-disable-next-line no-undef

// address for development process only
// const BASE_URL = process.env.BASE_API_URL

// address for production
const BASE_URL = import.meta.env.PROD ? 'https://roomies-backend-2yba.onrender.com/api' : '/api'

export default BASE_URL