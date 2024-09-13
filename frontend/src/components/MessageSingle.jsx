import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate} from 'react-router-dom'
import { selectUser } from '../reducers/userReducer'
import MessageUpdateForm from './MessageUpdateForm'
import Wrapper from './styles/Wrapper'
import MessageWrapper from './styles/MessageWrapper'
import { PrimaryButton, SecondaryButton } from './styles/Buttons'
import messageService from '../services/message'
import { setNotification } from '../reducers/notificationReducer'
import { fetchMessages, deleteMessage, selectMessages } from '../reducers/messageReducer'

const SingleMessage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { id } = useParams()
  const messageId = Number(id)
  const messages = useSelector(selectMessages)
  const message = messages.find(msg => msg.id === messageId)
  const [isEditMode, setIsEditMode] = useState(false)

  if (!user) return null

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  const handleUpdateSuccess = () => {
    setIsEditMode(false)
  }

  const handleDeleteMessage = async (event) => {
    event.preventDefault()
    const result = await messageService.deleteMessage(id, user)
    if (result.success) {
      dispatch(deleteMessage(id))
      dispatch(fetchMessages())
      if (messages.length > 1) {
        dispatch(setNotification('Message deleted', 'success', 5))
        navigate('/notifications')
      } else if (messages.length === 1 || messages.length === 0) {
        navigate('/notifications')
        window.location.reload() // I don't know how to solve a problem with the last message visibility after deletion without reloading page
        dispatch(setNotification('Message deleted', 'success', 5))
      }
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (message) {
    return (
      <>
        <Wrapper>
          <h3>Current message</h3>
          <MessageWrapper>{message.content}</MessageWrapper>
          {user.admin && user.enabled ?
            <>
              <PrimaryButton onClick={handleEditClick}>
                {isEditMode ? 'Cancel' : 'Edit'}
              </PrimaryButton>
              <SecondaryButton onClick={handleDeleteMessage}>
                Delete
              </SecondaryButton>
            </>
          : null}
        </Wrapper>
        {isEditMode && user.admin && user.enabled ?
          <MessageUpdateForm
            message={message}
            id={messageId}
            onUpdateSuccess={handleUpdateSuccess}
          />
        : null}
      </>
    )
  } else {
    return (
      <Wrapper>
        <h3>Current message</h3>
        <p>No messages yet.</p>
      </Wrapper>
    )
  }
}

export default SingleMessage