import { Link } from 'react-router-dom'

const Menu = () => {
    const padding = {
      paddingRight: 5
    }

    return (
      <div>
        <Link style={padding} to="/signin">Sign in</Link>
        <Link style={padding} to="/signout">Sign out</Link>
      </div>
    )
  }

export default Menu