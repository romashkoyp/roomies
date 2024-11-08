import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../reducers/userReducer'
import Wrapper from './styles/Wrapper'
import Message from './Messages/Message'
import { selectMessages, selectMessagesLoading, selectMessagesError } from '../reducers/messageReducer'
import Spinner from './spinner'
import MainWrapper from './styles/MainWrapper'

const MainPage = () => {
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)
  const loading = useSelector(selectMessagesLoading)
  const error = useSelector(selectMessagesError)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    let timer
    if (loading) {
      setShowSpinner(true)
    } else if (!loading && showSpinner) {
      timer = setTimeout(() => setShowSpinner(false), 700)
    }
    return () => clearTimeout(timer)
  }, [loading, showSpinner])

  return (
    <>
      <Wrapper>
        <h1>Roomies App</h1>
        <h2>Booking system for business</h2>
      </Wrapper>

      {user && 
        <MainWrapper>
          {showSpinner && <Spinner />}
          {!showSpinner && !loading && error && <p>Error: {error}</p>}
          {!showSpinner && !loading && !error && (<Message messages={messages} />)}
        </MainWrapper>
      }
    </>
  )
}

export default MainPage