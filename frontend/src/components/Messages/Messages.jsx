import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUser } from '../../reducers/userReducer'
import MessageForm from './MessageForm'
import Wrapper from '../styles/Wrapper'
import MessageWrapper from '../styles/MessageWrapper'
import { selectMessages, selectMessagesLoading, selectMessagesError } from '../../reducers/messageReducer'
import Spinner from '../spinner'
import useDelayedLoading from '../../services/delayedLoading'

const Messages = () => {
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)
  const loading = useSelector(selectMessagesLoading)
  const error = useSelector(selectMessagesError)
  const showSpinner = useDelayedLoading(loading)

  if (!user) return null

  return (
    <>
      {user.admin && user.enabled && <MessageForm />}
      {showSpinner && <Spinner />}
      {!showSpinner && !loading && error && <p>Error: {error}</p>}
      {!showSpinner && !loading && !error && (
        <Wrapper>
          <h3><i style={{ paddingRight: '0.5em' }} className="fa-regular fa-envelope" />Last messages</h3>
          {messages.length == 0 ? <p>No messages found.</p> :
            messages.map((m) => (
              <Link to={`/notifications/${m.id}`} key={m.id}>
                <MessageWrapper>{m.content}</MessageWrapper>
              </Link>
            ))
          }
        </Wrapper>
      )}
    </>
  )
}

export default Messages