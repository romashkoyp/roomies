import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import signinService from './services/signin'
import SigninForm from './components/signinForm'
import SignupForm from './components/SignUpForm'
import signoutService from './services/signout'
import {
  setUsername,
  selectUsername,
  setPassword,
  selectPassword,
  setUser,
  selectUser
} from './reducers/userReducer'
import { SecondaryButton } from './components/styles/Buttons'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'

const App = () => {
  const username = useSelector(selectUsername)
  const password = useSelector(selectPassword)
  const user = useSelector(selectUser)
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

  const handleSignin = async (event) => {
    event.preventDefault()
    const result = await signinService.signin({ username, password })

    if (result.success) {
      const user = result.data
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      signinService.setToken(user.token)
      dispatch(setNotification(`You have successfully signed in to Roomies App as ${user.name}`, 'success', 5))
      dispatch(setUser(user))
      dispatch(setUsername(''))
      dispatch(setPassword(''))
    } else {
      dispatch(setNotification(result.error, 'error', 5))
      window.localStorage.removeItem('loggedUser')
    }
  }

  const handleSignout = async (event) => {
    event.preventDefault()
    try {
      await signoutService.signout()
      window.localStorage.removeItem('loggedUser')
      dispatch(setUser(null))
      signinService.setToken(null)
      dispatch(setNotification('You have successfully signed out', 'success', 5))
    } catch (exception) {
      console.error('Signout error:', exception)
      dispatch(setNotification('Sign out failed', 'error', 5))
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification />
        {/* <h2>Sign in to application</h2>
        <Notification />
        <SigninForm
          username={username}
          password={password}
          handleUsernameChange={(newUsername) => dispatch(setUsername(newUsername))}
          handlePasswordChange={(newPassword) => dispatch(setPassword(newPassword))}
          handleSubmit={handleSignin}
        /> */}
        <SignupForm />
      </div>
    )
  } else {
    return (
      <div>
        <h2>Roomies app</h2>
          <Notification />
          <p>Welcome, {user.name}!</p>
          <SecondaryButton
            type="button"
            onClick={handleSignout}
          >Sign Out</SecondaryButton>
      </div>
    )
  }
}

export default App