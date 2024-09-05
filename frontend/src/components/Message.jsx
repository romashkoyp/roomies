import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import Wrapper from './styles/Wrapper'
import MessageWrapper from './styles/MessageWrapper'

const Message = ({ messages }) => {
  // console.log('Messages received in Message component:', messages)
  const user = useSelector(selectUser)

  if (!user) return null

  if (Array.isArray(messages) && messages.length > 0) {
    const firstThreeMessages = messages.slice(0, 3)

    return (
      <Wrapper>
        <h3>Last messages</h3>
          {firstThreeMessages.map((m, index) => {
            const truncatedContent = m.content.length > 50 
              ? m.content.substring(0, 50) + '...'
              : m.content
            return (
              <Link to="/messages" key={index}>
                <MessageWrapper >{truncatedContent}</MessageWrapper>
              </Link>
            )
          })}
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <h3>Last messages</h3>
        <p>No messages yet.</p>
      </Wrapper>
    )
  }
}

Message.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired
    })
  ).isRequired
}

export default Message