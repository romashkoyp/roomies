import PropTypes from 'prop-types'
import { useEffect, useRef,useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'

import { fetchMessages } from '../../reducers/messageReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import messageService from '../../services/message'
import ResizableTextarea from '../ResizableTextarea'
import { PrimaryButton } from '../styles/Buttons'
import CloseButtonWrapper from '../styles/CloseButtonWrapper'
import Wrapper from '../styles/Wrapper'

const MessageUpdateForm = ({ message, id, onUpdateSuccess, onCloseEdit }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [content, setContent] = useState(message.content)
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await messageService.updateMessage(id, content)
    if (result.success) {
      dispatch(fetchMessages())
      onUpdateSuccess()
      dispatch(setNotification('Message updated', 'success', 5))
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
          <h3>Edit current message</h3>
          <i className="fa-solid fa-xmark fa-xl" style={{ cursor: 'pointer'}} onClick={onCloseEdit}></i>
        </CloseButtonWrapper>
        
        <form ref={formRef} onSubmit={handleSubmit}>
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
  onUpdateSuccess: PropTypes.func.isRequired,
  onCloseEdit: PropTypes.func.isRequired
}

export default MessageUpdateForm