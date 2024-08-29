import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import signinService from './services/signin'
import SigninForm from './components/signinForm'
import {
  setUsername,
  selectUsername,
  setPassword,
  selectPassword,
  setUser
} from './reducers/userReducer'

const App = () => {
  const username = useSelector(selectUsername)
  const password = useSelector(selectPassword)
  const user = useSelector(setUser)
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
      const user = await signinService.signin({
        username, password,
      })

    if (user) {
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      signinService.setToken(user.token)

      dispatch(setUser(user))
      dispatch(setUsername(''))
      dispatch(setPassword(''))
    } else {
      console.error('Signin failed')
    }
  }

  console.log(user)

  if (!user) {
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
    </div>
  )
  }
}

export default App