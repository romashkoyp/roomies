import Input from './styles/Input'
import Wrapper from './styles/Wrapper'
import { PrimaryButton } from './styles/Buttons'
import signinService from '../services/signin'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  setUsername,
  selectUsername,
  setPassword,
  selectPassword,
  setUser
} from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'

const SigninForm = () => {
  const username = useSelector(selectUsername)
  const password = useSelector(selectPassword)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignin = async (event) => {
    event.preventDefault()
    const result = await signinService.signin({ username, password })

    if (result.success) {
      const user = result.data
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      signinService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setNotification(`You have successfully signed in to Roomies App as ${user.name}`, 'success', 5))
      dispatch(setUsername(''))
      dispatch(setPassword(''))
      navigate('/')
    } else {
      dispatch(setNotification(result.error, 'error', 5))
      window.localStorage.removeItem('loggedUser')
    }
  }

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value
    dispatch(setUsername(newUsername))
  }

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value
    dispatch(setPassword(newPassword))
  }

  return (
    <Wrapper>
      <h2>Sign In</h2>
      <form onSubmit={handleSignin}>
        <div>
          Username
          <Input
            type="email"
            placeholder="email"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="current-username"
          />
        </div>
        <div>
          Password
          <Input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
        </div>
        <PrimaryButton type="submit">Sign In</PrimaryButton>
      </form> 
    </Wrapper>
  )
}

export default SigninForm