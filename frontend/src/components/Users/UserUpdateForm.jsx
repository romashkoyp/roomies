import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { fetchUser, selectUser, selectCurrentUser, fetchCurrentUser } from '../../reducers/userReducer'
import userService from '../../services/user'

const UserUpdateForm = ({ id, onUpdateSuccess }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const currentUser = useSelector(selectCurrentUser)
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    admin: false,
    enabled: false
  })
  const [originalData, setOriginalData] = useState({})

  useEffect(() => {
    setFormData(currentUser)
    setOriginalData(currentUser)
  }, [currentUser, dispatch])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const updatedFields = {}
    Object.keys(formData).forEach(key => {
      if (formData[key] !== originalData[key]) {
        updatedFields[key] = formData[key]
      }
    })

    const result = await userService.updateUser(
      id,
      updatedFields.username,
      updatedFields.name,
      updatedFields.admin,
      updatedFields.enabled)

    if (result.success) {
      if (user.id === id) {
        const storedUser = JSON.parse(window.localStorage.getItem('loggedUser'))
        const updatedUser = {
          ...storedUser,
          ...updatedFields
        }
        window.localStorage.setItem('loggedUser', JSON.stringify(updatedUser))
        dispatch(fetchUser(id))
      }
      dispatch(fetchCurrentUser(id))
      dispatch(setNotification('User updated', 'success', 5))
      onUpdateSuccess()
      } else {
        dispatch(setNotification(result.error, 'error', 5))
      }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <h3>Edit current user</h3>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="admin">Admin Status</label>
            <input
              type="checkbox"
              id="admin"
              name="admin"
              checked={formData.admin}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="enabled">Active Status</label>
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={formData.enabled}
              onChange={handleChange}
            />
          </div>
          
          <PrimaryButton type="submit">Save</PrimaryButton>
        </form>
      </Wrapper>
    )
  }
}

UserUpdateForm.propTypes = {
  id: PropTypes.number.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired
}

export default UserUpdateForm