import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import signinService from '../services/signin'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import styled from 'styled-components'

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`

const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  padding: 10px 15px;
  color: #333;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #B1D4E0;
  }

  &.active {
    background-color: #1B263B;
    color: white;
  }
`

const NavLinkStyledSignOut = styled(NavLink)`
  text-decoration: none;
  padding: 10px 15px;
  color: #333;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #B1D4E0;
  }
`

const Menu = () => {
  const user = useSelector((state) => state.users.user)
  const dispatch = useDispatch()

  const handleSignout = async () => {
    if (confirm("Are you sure?")) {
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
  }

  return (
    <StyledNav>
      <NavList>
        <NavLinkStyled to="/" end>Roomies App</NavLinkStyled>
          {user?.admin && (
            <>
              <NavLinkStyled to="/notifications">Messages</NavLinkStyled>
              <NavLinkStyled to="/users">Users</NavLinkStyled>
              <NavLinkStyled to="/rooms/dates">Dates</NavLinkStyled>
            </>
          )}
          {user && <NavLinkStyled to="/rooms">Rooms</NavLinkStyled>}
      </NavList>
      <NavList>
        {user ? (
          <>
            <NavLinkStyled to={`/users/${user.id}`} end>{user.name}</NavLinkStyled>
            <NavLinkStyledSignOut to="/" end onClick={handleSignout}>Sign Out</NavLinkStyledSignOut>
          </>
        ) : (
          <>
            <NavLinkStyled to="/signin">Sign In</NavLinkStyled>
            <NavLinkStyled to="/signup">Sign Up</NavLinkStyled>
          </>
        )}
      </NavList>
    </StyledNav>
  )
}

export default Menu