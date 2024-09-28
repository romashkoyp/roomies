// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from './components/styles/Container'
import SigninForm from './components/signinForm'
import SignupForm from './components/signupForm'
import Messages from './components/Messages/Messages'
import MainPage from './components/MainPage'
import MessageSingle from './components/Messages/MessageSingle'
import AllUsersView from './components/Users/AllUsersView'
import UserSingle from './components/Users/UserSingle'
import AllRoomsView from './components/Rooms/AllRoomsView'
import RoomSingle from './components/Rooms/RoomSingle'
import DateSingle from './components/Rooms/IndividualDates/DateSingle'
import Menu from './components/Menu'
import Notification from './components/Notification'
import { selectUser, setUser, selectUsers, fetchUsers, fetchUser, selectCurrentUser } from './reducers/userReducer'
import { selectRooms, fetchRooms, fetchRoom, selectCurrentRoom } from './reducers/roomReducer'
import { selectMessages, selectMessage, fetchMessages, fetchMessage } from './reducers/messageReducer'
import signinService from './services/signin'
import AllDatesView from './components/Rooms/IndividualDates/AllDatesView'
import { selectIndividualDates, selectIndividualDatesForRoom, fetchAllIndividualDates, fetchIndividualDatesForRoom } from './reducers/individualDateReducer'
import AllRoomDates from './components/Rooms/IndividualDates/AllRoomDates'
import AllWeekdaysView from './components/Weekdays/AllWeekdaysView'
import { fetchWeekdays, selectWeekdays } from './reducers/weekdayReducer'

const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector(selectUser)
  // eslint-disable-next-line no-unused-vars
  const users = useSelector(selectUsers)
  // eslint-disable-next-line no-unused-vars
  const messages = useSelector(selectMessages)
  // eslint-disable-next-line no-unused-vars
  const message = useSelector(selectMessage)
  // eslint-disable-next-line no-unused-vars
  const currentUser = useSelector(selectCurrentUser)
  // eslint-disable-next-line no-unused-vars
  const rooms = useSelector(selectRooms)
  // eslint-disable-next-line no-unused-vars
  const currentRoom = useSelector(selectCurrentRoom)
  // eslint-disable-next-line no-unused-vars
  const individualDates = useSelector(selectIndividualDates)
  // eslint-disable-next-line no-unused-vars
  const individualDatesForRoom = useSelector(selectIndividualDatesForRoom)
  // eslint-disable-next-line no-unused-vars
  const weekdays = useSelector(selectWeekdays)

  // Fetch logged in user data
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      try {
      const user = JSON.parse(loggedUserJSON)
        if (user?.token) {
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

  // Fetch all messages and users
  useEffect(() => {
    if (user?.enabled) {
      dispatch(fetchMessages())
      if (user.admin) {
        dispatch(fetchUsers())
      }
    }
  }, [dispatch, user])

  // Fetch one message
  useEffect(() => {
    const path = location.pathname.split('/')
    const notificationIdIndex = path.indexOf('notifications') + 1
    const notificationId = path[notificationIdIndex]

    if (/^\d+$/.test(notificationId)) {
      const currentNotificationId = Number(notificationId)
      if (user?.enabled && path[1] === 'notifications' && currentNotificationId > 0) {
        dispatch(fetchMessage(currentNotificationId))
      }
    }
  }, [dispatch, user, location.pathname])
  
  // Fetch one user
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

  // Fetch all rooms
  useEffect(() => {
    if (user?.enabled) {
      dispatch(fetchRooms())
    }
  }, [dispatch, user])

  // Fetch one room
  useEffect(() => {
    const path = location.pathname.split('/')
    const roomIdIndex = path.indexOf('rooms') + 1
    const roomId = path[roomIdIndex]

    if (/^\d+$/.test(roomId)) {
      const currentRoomId = Number(roomId)
      if (user?.enabled && path[1] === 'rooms' && currentRoomId > 0) {
        dispatch(fetchRoom(currentRoomId))
      }
    }
  }, [dispatch, user, location.pathname])

  // Fetch all individual dates for all rooms
  useEffect(() => {
    const path = location.pathname.split('/')
    if (user?.enabled) {
      if (path.length === 3 && path[1] === 'rooms' && path[2] === 'dates') {
        dispatch(fetchAllIndividualDates())
      }
    }
  }, [dispatch, user, location.pathname ])

  // Fetch all individual dates for one room
  useEffect(() => {
    const path = location.pathname.split('/')
    const roomIdIndex = path.indexOf('rooms') + 1
    const roomId = path[roomIdIndex]

    if (/^\d+$/.test(roomId)) {
      const currentRoomId = Number(roomId)
      if (user?.enabled) {
        if (path.length === 5 && path[1] === 'rooms' && path[3] === 'dates') {
          dispatch(fetchIndividualDatesForRoom(currentRoomId))
        }
      }
    }
  }, [dispatch, user, location.pathname])

  // Fetch all weekdays for settings
  useEffect(() => {
    if (user?.enabled && user.admin) {
      dispatch(fetchWeekdays())
    }
  }, [dispatch, user])

  return (
    <Container>
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
        <Route path="/rooms" element={<AllRoomsView />}/>
        <Route path="/rooms/:id" element={<RoomSingle />}/>
        <Route path="/rooms/dates" element={<AllDatesView />}/>
        <Route path="/rooms/:id/dates" element={<AllRoomDates/>}/>
        <Route path="/rooms/:id/dates/:date" element={<DateSingle/>}/>
        <Route path="/settings/weekdays" element={<AllWeekdaysView/>}/>
      </Routes>
    </Container>
  )
}

export default App