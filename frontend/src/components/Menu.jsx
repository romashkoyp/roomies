import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import signinService from '../services/signin'
import { setNotification } from '../reducers/notificationReducer'
import {
  setUser,
  selectUser
} from '../reducers/userReducer'

const Menu = () => {
  const padding = { paddingRight: 15 }
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const handleSignout = async () => {
    try {
      window.localStorage.removeItem('loggedUser')
      dispatch(setUser(null))
      signinService.setToken(null)
      dispatch(setNotification('You have successfully signed out', 'success', 5))
    } catch (exception) {
      console.error('Signout error:', exception)
      dispatch(setNotification('Sign out failed', 'error', 5))
    }
  }

  return (
    <div>
      <Link style={padding} to="/">Roomies App</Link>
      {user 
        ? <Link style={padding} onClick={handleSignout} to="/">Sign Out</Link>
        : <Link style={padding} to="/signin">Sign In</Link> 
      }
      {user 
        ? user.name
        : <Link style={padding} to="/signup">Sign Up</Link>
      }
    </div>
  )
}

export default Menu