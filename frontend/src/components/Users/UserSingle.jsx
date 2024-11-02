import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { selectUser, fetchUsers, selectCurrentUser } from '../../reducers/userReducer'
import UserUpdateForm from './UserUpdateForm'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton, SecondaryButton } from '../styles/Buttons'
import userService from '../../services/user'
import { setNotification } from '../../reducers/notificationReducer'

const SingleUser = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { id } = useParams()
  const currentUserId = Number(id)
  const currentUser = useSelector(selectCurrentUser)
  const [isEditMode, setIsEditMode] = useState(false)

  if (!user) return null

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  const handleUpdateSuccess = () => {
    setIsEditMode(false)
  }

  const handleDeleteUser = async (event) => {
    event.preventDefault()
    if (confirm("Are you sure?")) { 
      const result = await userService.deleteUser(id)
      if (result.success) {
        dispatch(fetchUsers())
        dispatch(setNotification('User deleted', 'success', 5))
        navigate('/users')
      } else {
        dispatch(fetchUsers())
        dispatch(setNotification(result.error, 'error', 5))
      }
    } else return null
  }

  console.log(user ? user.id : 'no user')
  console.log(currentUser ? currentUser.id : 'no current user')
  
  if (currentUser) {
    return (
      <>
        <Wrapper>
          <h3>{currentUser.name}</h3>
          <table>
            <tbody>
              <tr>
                <th>User ID</th>
                <td>{currentUser.id}</td>
              </tr>
              <tr>
                <th>Username</th>
                <td>{currentUser.username}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{currentUser.name}</td>
              </tr>
              <tr>
                <th>Admin Status</th>
                <td>{currentUser.admin ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <th>Active Status</th>
                <td>{currentUser.enabled ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>
        
          {user.admin && user.enabled ?
            <>
              <PrimaryButton onClick={handleEditClick}>
                {isEditMode ? 'Cancel' : 'Edit'}
              </PrimaryButton>
              <SecondaryButton onClick={handleDeleteUser}>
                Delete
              </SecondaryButton>
            </>
          : null}
        </Wrapper>
        {isEditMode && user.admin && user.enabled ?
          <UserUpdateForm
            id={currentUserId}
            onUpdateSuccess={handleUpdateSuccess}
          />
        : null}
      </>
    )
  } else {
    return (
      <Wrapper>
        <h3>Current user</h3>
        <p>No user found</p>
      </Wrapper>
    )
  }
}

export default SingleUser