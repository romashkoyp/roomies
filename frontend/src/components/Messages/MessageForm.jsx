import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import { fetchMessages } from '../../reducers/messageReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import messageService from '../../services/message'
import ResizableTextarea from '../ResizableTextarea'
import { PrimaryButton } from '../styles/Buttons'
import CloseButtonWrapper from '../styles/CloseButtonWrapper'
import LinkHeader from '../styles/LinkHeader'
import Wrapper from '../styles/Wrapper'

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
          <LinkHeader onClick={handleClick}>
            <h3>
              <i style={{ paddingRight: '0.5em' }} className='fa-regular fa-comment-dots' />
              Add new message
            </h3>
          </LinkHeader>
          {isVisible && <i className="fa-solid fa-xmark fa-xl" style={{ cursor: 'pointer'}} onClick={handleClick}></i>}
        </CloseButtonWrapper>      
        {isVisible &&
          <form onSubmit={handleSubmit}>
            <div>
              <ResizableTextarea
                type='text'
                id='message'
                name='message'
                value={content}
                onChange={handleChange}
              />
            </div>
            <PrimaryButton type='submit'>Submit</PrimaryButton>
          </form>
        }
      </Wrapper>
    )
  }
}

export default MessageForm