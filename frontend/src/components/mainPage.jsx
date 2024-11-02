import { useSelector } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import Wrapper from './styles/Wrappers'
import Message from './Messages/Message'
import { selectMessages } from '../reducers/messageReducer'

const MainPage = () => {
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)

  if (user) {
    return (
      <>
        <Wrapper>
          <h1>Welcome to Roomies App</h1>
        </Wrapper>
        <Message messages={messages} />
      </>
    )
  } else {
    return (
      <Wrapper>
        <h1>Roomies App</h1>
        <h2>Booking system for business</h2>
      </Wrapper>
    )
  }
}

export default MainPage