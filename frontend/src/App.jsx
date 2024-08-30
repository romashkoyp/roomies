import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import signinService from './services/signin'
import SigninForm from './components/signinForm'
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

const App = () => {
  const username = useSelector(selectUsername)
  const password = useSelector(selectPassword)
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      signinService.setToken(user.token)
    }
  }, [dispatch])

  const handleSignin = async (event) => {
    event.preventDefault()
    try {
      const user = await signinService.signin({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      signinService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setUsername(''))
      dispatch(setPassword(''))
    } catch (error) {
      console.log('Failed to signin', error)
    }
  }

  const handleSignout = async (event) => {
    event.preventDefault()
    try {
      await signoutService.signout()
      window.localStorage.removeItem('loggedUser')
      dispatch(setUser(null))
    } catch (error) {
      console.log('Failed to signout', error)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Sign in to application</h2>
        <SigninForm
          username={username}
          password={password}
          handleUsernameChange={(newUsername) => dispatch(setUsername(newUsername))}
          handlePasswordChange={(newPassword) => dispatch(setPassword(newPassword))}
          handleSubmit={handleSignin}
        />
      </div>
    )
  } else {
    return (
      <div>
        <h2>Roomies app</h2>
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