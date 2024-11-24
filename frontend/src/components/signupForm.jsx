import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setNotification } from '../reducers/notificationReducer'
import signupService from '../services/signup'
import { PrimaryButton } from './styles/Buttons'
import StyledInput from './styles/InputValidationStyle'
import Wrapper from './styles/Wrapper'

const SignupForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (event) => {
    event.preventDefault()
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
      case 'name':
        if (value.trim() === '') {
          errorMessage = 'Name is required'
        }
        break
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
      case 'confirmPassword':
        if (value.trim() === '') {
          errorMessage = 'Confirm password is required'
        } else if (value !== formData.password) {
          errorMessage = 'Passwords do not match'
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { name, username, password, confirmPassword } = formData
    const result = await signupService.signup({ name, username, password, confirmPassword })

    if (result.success) {
      dispatch(setNotification(
        'You are successfully signed up. Use your email and password to sign in to Roomies App.',
        'success',
        5
      ))
  
      setFormData({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
      })
      setFormErrors({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
      })
      navigate('/signin')
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  return (
    <Wrapper style={{ maxWidth: '350px', alignSelf: 'center', padding: '2em' }}>
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <div className="input-container">
            <StyledInput
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              hasError={formErrors.name.length > 0}
            />
            {formErrors.name && <div className="error">{formErrors.name}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Username</label>
          <div className="input-container">
            <StyledInput
              type="email"
              placeholder="Email"
              name="username"
              id="email"
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
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              hasError={formErrors.password.length > 0}
            />
            {formErrors.password && <div className="error">{formErrors.password}</div>}
          </div>
        </div>
    
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="input-container">
            <StyledInput
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              hasError={formErrors.confirmPassword.length > 0}
            />
            {formErrors.confirmPassword && <div className="error">{formErrors.confirmPassword}</div>}
          </div>
        </div>
        
        <PrimaryButton type="submit">Sign Up</PrimaryButton>
      </form>
    </Wrapper>
  )
}

export default SignupForm