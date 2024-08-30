import { useState } from 'react'
import Input from './styles/Input'
import { PrimaryButton } from './styles/Buttons'
import signupService from '../services/signup'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const SignupForm = () => {
  const dispatch = useDispatch()
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
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Name
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        Username (as your email)
        <Input
          type="email"
          placeholder="Email"
          name="username"
          id="email"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        Password
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        Confirm password
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <PrimaryButton type="submit">Sign Up</PrimaryButton>
    </form>
  )
}

export default SignupForm