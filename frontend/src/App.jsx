import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SigninForm from './components/signinForm'
import SignupForm from './components/signupForm'
import Messages from './components/Messages'
import MainPage from './components/mainPage'
import Menu from './components/Menu'
import Notification from './components/Notification'
import { setUser } from './reducers/userReducer'
import { setMessages, selectMessages } from './reducers/messageReducer'
import signinService from './services/signin'
import messageService from './services/message'

const App = () => {
  const dispatch = useDispatch()
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
    const fetchData = async () => {
      const result = await messageService.getAllMessages()
      if (result.success) {
        // console.log('API Response:', result)
        dispatch(setMessages(result.data))
      } else {
        console.error('Error fetching messages:', result.error)
      }
    }
    fetchData()
  }, [dispatch])

  // console.log('Messages in App:', messages)

  return (
    <div>
      <Router>
        <Menu />
        <Notification />
        <Routes>
          <Route path="/" element={<MainPage messages={messages}/>}/>
          <Route path="/signin" element={<SigninForm />}/>
          <Route path="/signup" element={<SignupForm />}/>
          <Route path="/messages" element={<Messages messages={messages}/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App