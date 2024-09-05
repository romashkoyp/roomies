import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import MessageForm from './messageForm'
import Wrapper from './styles/Wrapper'
import MessageWrapper from './styles/MessageWrapper'

const Messages = ({ messages }) => {
  const user = useSelector(selectUser)

  if (!user) return null

  if (Array.isArray(messages) && messages.length > 0) {
    return (
      <>
        {user.admin && user.enabled ? <MessageForm /> : null}
        <Wrapper>
          <h3>Last messages</h3>
          {messages.map((message, index) => (
            <MessageWrapper key={index}>{message.content}</MessageWrapper>
            )
          )}
        </Wrapper>
      </>
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

Messages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired
    })
  ).isRequired
}

export default Messages