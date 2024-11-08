import { useSelector } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import Wrapper from './styles/Wrapper'
import Message from './Messages/Message'
import { selectMessages, selectMessagesLoading, selectMessagesError } from '../reducers/messageReducer'
import Spinner from './spinner'
import useDelayedLoading from '../services/delayedLoading'

const MainPage = () => {
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)
  const loading = useSelector(selectMessagesLoading)
  const error = useSelector(selectMessagesError)
  const showSpinner = useDelayedLoading(loading)

  return (
    <>
      <Wrapper>
        <h1>Roomies App</h1>
        <h2>Booking system for business</h2>
      </Wrapper>

      {user && 
        <>
          {showSpinner && <Spinner />}
          {!showSpinner && !loading && error && <p>Error: {error}</p>}
          {!showSpinner && !loading && !error && <Message messages={messages} />}
        </>
      }
    </>
  )
}

export default MainPage