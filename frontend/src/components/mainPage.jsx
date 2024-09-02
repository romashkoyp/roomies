import { useSelector } from 'react-redux'
import { selectUser } from '../reducers/userReducer'

const MainPage = () => {
  const user = useSelector(selectUser)

  if (user) {
    return (
      <div>
        <br></br>
        <h2>Welcome to Roomies App</h2>
      </div>
    )
  } else {
    return (
      <div>
        <br></br>
        <h2>Roomies App</h2>
        <h3>Booking system for business</h3>
    </div>
    )
  }
}

export default MainPage