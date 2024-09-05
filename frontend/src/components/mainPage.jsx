import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { selectUser } from '../reducers/userReducer'
import Wrapper from './styles/Wrapper'
import Message from './Message'

const MainPage = ({ messages }) => {
  const user = useSelector(selectUser)

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

MainPage.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired
    })
  ).isRequired
}

export default MainPage