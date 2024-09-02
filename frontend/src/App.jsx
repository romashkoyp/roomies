import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import SigninForm from './components/signinForm'
import SignupForm from './components/SignUpForm'
import MainPage from './components/mainPage'
import Menu from './components/Menu'
import Notification from './components/Notification'
import { setUser } from './reducers/userReducer'
import signinService from './services/signin'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      try {
      const user = JSON.parse(loggedUserJSON)
        if (user && user.token) {
          dispatch(setUser(user))
          signinService.setToken(user.token)
        } else {
          window.localStorage.removeItem('loggedUser')
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        window.localStorage.removeItem('loggedUser')
      }
    }
  }, [dispatch])

  return (
    <div>
      <Router>
        <Menu />
        <Notification />
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/signin" element={<SigninForm />}/>
          <Route path="/signup" element={<SignupForm />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App