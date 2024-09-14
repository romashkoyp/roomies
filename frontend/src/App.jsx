// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SigninForm from './components/signinForm'
import SignupForm from './components/signupForm'
import Messages from './components/Messages'
import MainPage from './components/MainPage'
import MessageSingle from './components/MessageSingle'
import AllUsersView from './components/Users/AllUsersView'
import UserSingle from './components/Users/UserSingle'
import Menu from './components/Menu'
import Notification from './components/Notification'
import { selectUser, setUser, selectUsers, fetchUsers, fetchUser, selectCurrentUser } from './reducers/userReducer'
import { selectMessages, fetchMessages } from './reducers/messageReducer'
import signinService from './services/signin'

const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector(selectUser)
  // eslint-disable-next-line no-unused-vars
  const users = useSelector(selectUsers)
  // eslint-disable-next-line no-unused-vars
  const messages = useSelector(selectMessages)
  // eslint-disable-next-line no-unused-vars
  const currentUser = useSelector(selectCurrentUser)

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

  useEffect(() => {
    if (user) {
      dispatch(fetchMessages())
      if (user.admin && user.enabled) {
        dispatch(fetchUsers())
      }
    }
  }, [dispatch, user])

  useEffect(() => {
    const path = location.pathname.split('/')
    const userIdIndex = path.indexOf('users') + 1
    const userId = path[userIdIndex]

    if (/^\d+$/.test(userId)) {
      const currentUserId = Number(userId)
      if (user?.admin && user.enabled) {
        dispatch(fetchUser(currentUserId))
      }
    }
  }, [dispatch, user, location.pathname])

  return (
    <div>
      <Menu />
      <Notification />
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/signin" element={<SigninForm />}/>
        <Route path="/signup" element={<SignupForm />}/>
        <Route path="/notifications" element={<Messages />}/>
        <Route path="/notifications/:id" element={<MessageSingle />}/>
        <Route path="/users" element={<AllUsersView />}/>
        <Route path="/users/:id" element={<UserSingle />}/>
      </Routes>
    </div>
  )
}

export default App