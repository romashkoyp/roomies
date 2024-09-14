import { useState } from 'react'
import { useSelector } from 'react-redux'
import Wrapper from './styles/Wrapper'
import { PrimaryButton } from './styles/Buttons'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import messageService from '../services/message'
import { fetchMessages, addMessage } from '../reducers/messageReducer'
import ResizableTextarea from './ResizableTextarea'

const MessageForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [content, setContent] = useState('Message 1')

  const handleChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await messageService.postMessage({ content })

    if (result.success) {
      dispatch(addMessage(result.data))
      dispatch(fetchMessages())
      dispatch(setNotification('Message created', 'success', 5))
      setContent('')
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <h3>Add new message</h3>
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
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </form>
      </Wrapper>
    )
  }
}

export default MessageForm