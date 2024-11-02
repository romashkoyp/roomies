import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../reducers/userReducer'
import { selectMessages } from '../../reducers/messageReducer'
import {Wrapper, MessageWrapper} from '../styles/Wrappers'
import LinkHeader from '../styles/LinkHeader'

const Message = () => {
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)

  if (!user) return null

  if (messages?.length > 0) {
    const firstThreeMessages = messages.slice(0, 3)

    return (
      <Wrapper>
        <LinkHeader><Link to="/notifications"><h3>Messages</h3></Link></LinkHeader>
          {firstThreeMessages.map((m) => {
            const truncatedContent = m.content.length > 50 
              ? m.content.substring(0, 50) + '...'
              : m.content
            return (
              <Link to={`/notifications/${m.id}`} key={m.id}>
                <MessageWrapper>{truncatedContent}</MessageWrapper>
              </Link>
            )
          })}
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <LinkHeader><Link to="/notifications"><h3>Messages</h3></Link></LinkHeader>
        <p>No messages yet.</p>
      </Wrapper>
    )
  }
}

export default Message