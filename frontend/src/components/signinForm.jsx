import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setNotification } from '../reducers/notificationReducer'
import { fetchUser } from '../reducers/userReducer'
import signinService from '../services/signin'
import { PrimaryButton } from './styles/Buttons'
import StyledInput from './styles/InputValidationStyle'
import Wrapper from './styles/Wrapper'

const SigninForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: 'admin@admin.com',
    password: 'gfghlur4754675'
  })
  
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    validateField(name, value)
  }

  const validateField = (name, value) => {
    let errorMessage = ''
    switch (name) {
      case 'username':
        if (value.trim() === '') {
          errorMessage = 'Email is required'
        } else if (!isValidEmail(value)) {
          errorMessage = 'Invalid email address'
        }
        break
      case 'password':
        if (value.trim() === '') {
          errorMessage = 'Password is required'
        } else if (value.length < 8) {
          errorMessage = 'Password must be at least 8 characters long'
        }
        break
      default:
        break
    }
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage
    }))
  }

  const isValidEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
  }

  const handleSignin = async (event) => {
    event.preventDefault()
    const { username, password } = formData
    const result = await signinService.signin({ username, password })

    if (result.success) {
      const user = result.data
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      signinService.setToken(user.token)
      dispatch(fetchUser(user.id))
      dispatch(setNotification(`You have successfully signed in to Roomies App as ${user.name}`, 'success', 5))
      setFormData({ username: '', password: '' })
      setFormErrors({ username: '', password: '' })
      navigate('/')
    } else {
      dispatch(setNotification(result.error, 'error', 5))
      window.localStorage.removeItem('loggedUser')
    }
  }

  return (
    <Wrapper style={{ maxWidth: '350px', alignSelf: 'center', padding: '2em' }}>
      <form onSubmit={handleSignin}>
        <h2>Sign In</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-container">
            <StyledInput
              type="email"
              placeholder="Email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              hasError={formErrors.username.length > 0}
            />
            {formErrors.username && <div className="error">{formErrors.username}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <StyledInput
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              hasError={formErrors.password.length > 0}
            />
            {formErrors.password && <div className="error">{formErrors.password}</div>}
          </div>
        </div>
        
        <PrimaryButton type="submit">Sign In</PrimaryButton>
      </form>
    </Wrapper>
  )
}

export default SigninForm