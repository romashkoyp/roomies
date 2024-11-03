import { useState } from 'react'
import { useSelector } from 'react-redux'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { selectUser } from '../../reducers/userReducer'
import messageService from '../../services/message'
import { fetchMessages } from '../../reducers/messageReducer'
import ResizableTextarea from '../ResizableTextarea'
import LinkHeader from '../styles/LinkHeader'
import CloseButtonWrapper from '../styles/CloseButtonWrapper'

const MessageForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState('Message 1')

  const handleClick = () => {
    setIsVisible(!isVisible)
  }

  const handleChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await messageService.postMessage({ content })

    if (result.success) {
      dispatch(fetchMessages())
      dispatch(setNotification('Message created', 'success', 5))
      setContent('Message 2')
      setIsVisible(false)
    } else {
      dispatch(fetchMessages())
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <CloseButtonWrapper>
          <LinkHeader onClick={handleClick}><h3>Add new message</h3></LinkHeader>
          {isVisible ?
            <i className="fa-solid fa-xmark fa-xl" style={{ cursor: 'pointer'}} onClick={handleClick}></i>
          : null}
        </CloseButtonWrapper>      
        {isVisible ?
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
          : null}
      </Wrapper>
    )
  }
}

export default MessageForm