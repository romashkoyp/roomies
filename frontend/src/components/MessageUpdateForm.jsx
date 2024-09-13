import { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Wrapper from './styles/Wrapper'
import { PrimaryButton } from './styles/Buttons'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import messageService from '../services/message'
import { fetchMessages, updateMessage } from '../reducers/messageReducer'
import ResizableTextarea from './ResizableTextarea'

const MessageUpdateForm = ({ message, id, onUpdateSuccess }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [content, setContent] = useState(message.content)

  const handleChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await messageService.updateMessage(id, content, user)
    if (result.success) {
      dispatch(updateMessage(id))
      dispatch(fetchMessages())
      onUpdateSuccess()
      dispatch(setNotification('Message updated', 'success', 5))
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <h3>Edit current message</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <ResizableTextarea
              type="text"
              id="message"
              name="message"
              value={content}
              onChange={handleChange}
            />
          </div>
          <PrimaryButton type="submit">Save</PrimaryButton>
        </form>
      </Wrapper>
    )
  }
}

MessageUpdateForm.propTypes = {
  message: PropTypes.shape({ content: PropTypes.string.isRequired }),
  id: PropTypes.number.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired
}

export default MessageUpdateForm