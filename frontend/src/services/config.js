// eslint-disable-next-line no-undef


// const BASE_URL = process.env.BASE_API_URL

// address for development process only
// const BASE_URL = 'http://localhost:4000/api'

// address for production
// const BASE_URL = import.meta.env.PROD ? 'https://roomies-backend-2yba.onrender.com/api' : '/api'
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000/api'

export default BASE_URL