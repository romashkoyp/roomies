import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
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
import { setUser, selectUser } from './reducers/userReducer'
import { selectMessages, fetchMessages } from './reducers/messageReducer'
import signinService from './services/signin'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)

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
    if (user) dispatch(fetchMessages())
  }, [dispatch, user])

  return (
    <div>
      <Router>
        <Menu />
        <Notification />
        <Routes>
          <Route path="/" element={<MainPage messages={messages}/>}/>
          <Route path="/signin" element={<SigninForm />}/>
          <Route path="/signup" element={<SignupForm />}/>
          <Route path="/notifications" element={<Messages messages={messages}/>}/>
          <Route path="/notifications/:id" element={<MessageSingle messages={messages}/>}/>
          <Route path="/users" element={<AllUsersView />}/>
          <Route path="/users/:id" element={<UserSingle />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App