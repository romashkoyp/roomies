import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import userService from '../../services/user'
import Input from '../styles/Input'

const UserUpdateForm = ({ id, onUpdateSuccess }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    admin: false,
    enabled: false
  })
  const [originalData, setOriginalData] = useState({})

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await userService.getOneUser(id, user)
      if (result.success) {
        setFormData(result.data)
        setOriginalData(result.data)
      } else {
        dispatch(setNotification('Failed to fetch user data', 'error', 5))
      }
    }
    fetchUserData()
  }, [id, user, dispatch])

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

    if (Object.keys(updatedFields).length === 0) {
      dispatch(setNotification('No changes to update', 'success', 5))
      return
    }

    const result = await userService.updateUser(id, updatedFields.username, updatedFields.name, updatedFields.admin, updatedFields.enabled, user)
    if (result.success) {
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
          <div>
            Username:
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
            Name:
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
            Admin Status:
            <Input
              type="checkbox"
              id="admin"
              name="admin"
              checked={formData.admin}
              onChange={handleChange}
            />
          </div>
          <div>
            Active Status:
            <Input
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