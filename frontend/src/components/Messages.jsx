import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUser } from '../reducers/userReducer'
import MessageForm from './MessageForm'
import Wrapper from './styles/Wrapper'
import MessageWrapper from './styles/MessageWrapper'
import { selectMessages } from '../reducers/messageReducer'

const Messages = () => {
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)

  if (!user) return null

  if (Array.isArray(messages) && messages.length > 0) {
    return (
      <>
        {user.admin && user.enabled ? <MessageForm /> : null}
        <Wrapper>
          <h3>Last messages</h3>
          {messages.map((m) => (
            <Link to={`/notifications/${m.id}`} key={m.id}>
              <MessageWrapper>{m.content}</MessageWrapper>
            </Link>
          ))}
        </Wrapper>
      </>
    )
  } else {
    return (
      <>
        {user.admin && user.enabled ? <MessageForm /> : null}
        <Wrapper>
          <h3>Last messages</h3>
          <p>No messages yet.</p>
        </Wrapper>
      </>
    )
  }
}

export default Messages