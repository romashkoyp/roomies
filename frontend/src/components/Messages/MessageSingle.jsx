import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate} from 'react-router-dom'
import { selectUser } from '../../reducers/userReducer'
import MessageUpdateForm from './MessageUpdateForm'
import Wrapper from '../styles/Wrapper'
import MessageWrapper from '../styles/MessageWrapper'
import { PrimaryButton, SecondaryButton } from '../styles/Buttons'
import messageService from '../../services/message'
import { setNotification } from '../../reducers/notificationReducer'
import { fetchMessages, selectMessages } from '../../reducers/messageReducer'

const SingleMessage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)
  const { id } = useParams()
  const messageId = Number(id)
  const message = messages.find(item => item.id == messageId)
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
    if (confirm("Are you sure?")) {
      const result = await messageService.deleteMessage(id)
      if (result.success) {
        dispatch(fetchMessages())
        navigate('/notifications')
        dispatch(setNotification('Message deleted', 'success', 5))
      } else {
        dispatch(fetchMessages())
        dispatch(setNotification(result.error, 'error', 5))
      }
    } else return null
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