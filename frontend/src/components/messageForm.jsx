import { useState } from 'react'
import { useSelector } from 'react-redux'
import Input from './styles/Input'
import Wrapper from './styles/Wrapper'
import { PrimaryButton } from './styles/Buttons'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import messageService from '../services/message'
import { setMessages } from '../reducers/messageReducer'

const MessageForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [content, setContent] = useState('Message 1')

  const handleChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await messageService.postMessage({ content, user })

    if (result.success) {
      dispatch(setNotification('Message created', 'success', 5))
      setContent('')
      const messageResult = await messageService.getAllMessages()
      if (messageResult.success) {
        dispatch(setMessages(messageResult.data))
      } else {
        console.error('Error fetching updated messages:', messageResult.error)
        dispatch(setNotification('Failed to update message list', 'error', 5))
      }
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <h3>Add message</h3>
        <form onSubmit={handleSubmit}>
          <div>
            Message
            <Input
              type="text"
              id="message"
              name="message"
              placeholder="message"
              value={content}
              onChange={handleChange}
            />
          </div>
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </form>
      </Wrapper>
    )
  }
}

export default MessageForm