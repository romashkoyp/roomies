import { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams, useNavigate} from 'react-router-dom'
import { selectUser } from '../reducers/userReducer'
import MessageUpdateForm from './MessageUpdateForm'
import Wrapper from './styles/Wrapper'
import MessageWrapper from './styles/MessageWrapper'
import { PrimaryButton, SecondaryButton } from './styles/Buttons'
import messageService from '../services/message'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setMessages } from '../reducers/messageReducer'

const SingleMessage = ({ messages }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { id } = useParams()
  const messageId = Number(id)
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
      dispatch(setNotification('Message deleted', 'success', 5))
      const messageResult = await messageService.getAllMessages()
      if (messageResult.success) {
        dispatch(setMessages(messageResult.data))
        navigate('/notifications')
      } else {
        console.error('Error fetching updated messages:', messageResult.error)
        dispatch(setNotification('Failed to delete message', 'error', 5))
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

SingleMessage.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired
    })
  ).isRequired
}

export default SingleMessage