import { useState } from 'react'
import Wrapper from './styles/Wrapper'
import { PrimaryButton } from './styles/Buttons'
import signupService from '../services/signup'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUser } from '../reducers/userReducer'

const SignupForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: 'yaroslav',
    username: 'yaroslav@gmail.com',
    password: '12345678',
    confirmPassword: '12345678'
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { name, username, password, confirmPassword } = formData
    const result = await signupService.signup({ name, username, password, confirmPassword })

    if (result.success) {
      dispatch(addUser(result.data))
      // dispatch(fetchUsers())
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
      navigate('/signin')
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Username</label>
          <input
            type="email"
            placeholder="Email"
            name="username"
            id="email"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
    
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <PrimaryButton type="submit">Sign Up</PrimaryButton>
      </form>
    </Wrapper>
  )
}

export default SignupForm