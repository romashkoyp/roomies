import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate} from 'react-router-dom'
import { selectUser } from '../../reducers/userReducer'
import UserUpdateForm from './UserUpdateForm'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton, SecondaryButton } from '../styles/Buttons'
import userService from '../../services/user'
import { setNotification } from '../../reducers/notificationReducer'

const SingleUser = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [currentUser, setUser] = useState([])
  const { id } = useParams()
  const currentUserId = Number(id)
  const [isEditMode, setIsEditMode] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const result = await userService.getOneUser(id, user)
      console.log(result.data)
      if (result.success) {
        setUser(result.data)
      } else {
        console.error('Error fetching users:', result.error)
      }
    }
    fetchData()
  }, [id, user, updateTrigger])

  if (!user) return null

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  const handleUpdateSuccess = () => {
    setIsEditMode(false)
    setUpdateTrigger(prev => prev + 1)
  }

  const handleDeleteUser = async (event) => {
    event.preventDefault()
    const result = await userService.deleteUser(id, user)
    if (result.success) {
      dispatch(setNotification('User deleted', 'success', 5))
      const userResult = await userService.getOneUser(id, user)
      if (userResult.success === false) {
        navigate('/users')
      } else {
        dispatch(setNotification('Failed to delete user', 'error', 5))
      }
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (currentUser) {
    return (
      <>
        <Wrapper>
          <h3>Current user</h3>
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