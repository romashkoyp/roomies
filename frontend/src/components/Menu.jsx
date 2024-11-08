import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import signinService from '../services/signin'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import styled from 'styled-components'
import StyledSidebar from './styles/Sidebar'

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

const NavLinkStyledNoActive = styled(NavLink)`
  text-decoration: none;
  padding: 10px 15px;
  color: #333;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #B1D4E0;
  }
`

const LinkDropDown = styled(NavLink)`
  display: inline-block;
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

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover .dropdown-content {
    display: block;
  }
`

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 999;
`

const DropdownItem = styled(NavLink)`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;

  &:hover {
    background-color: #f1f1f1;
  }

  &.active {
    background-color: #B1D4E0;
  }
`

const Menu = () => {
  const user = useSelector((state) => state.users.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const isSettingsActive = location.pathname.startsWith('/settings')
  const [sidebarVisible, setSidebarVisible] = useState(false)

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

  const showSidebar = async () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <>
      <StyledSidebar visible={sidebarVisible}>
        <NavList className='sidebar-nav-ul'>
          <NavLinkStyled 
            style={{
              width: '10%',
              padding: '10% 5% 10% 85%',
              borderRadius: '0',
            }}
            onClick={showSidebar}
            to="#">
              <i className="fa-solid fa-xmark fa-xl" />
          </NavLinkStyled>
          <NavLinkStyled className='sidebar-li' to="/" end>Roomies App</NavLinkStyled>
            {user?.admin && (
              <>
                <NavLinkStyled className='sidebar-li' to="/notifications">Messages</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/users">Users</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/settings/weekdays">Weekdays</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/settings/dates">Holidays</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/rooms">Rooms</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/rooms/dates">Individual dates</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/bookings">Bookings</NavLinkStyled>
              </>
            )}

            {user && !user.admin && (
              <> 
                <NavLinkStyled className='sidebar-li' to="/notifications">Messages</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/rooms">Rooms</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/bookings">Bookings</NavLinkStyled>
              </>
            )}
        
        
          {user ? (
            <>
              <NavLinkStyled className='sidebar-li' to={`/users/${user.id}`} end>{user.name}</NavLinkStyled>
              <NavLinkStyledNoActive className='sidebar-li' to="/" end onClick={handleSignout}>Sign Out</NavLinkStyledNoActive>
            </>
          ) : (
            <>
              <NavLinkStyled className='sidebar-li' to="/signin">Sign In</NavLinkStyled>
              <NavLinkStyled className='sidebar-li' to="/signup">Sign Up</NavLinkStyled>
            </>
          )}
        </NavList>
      </StyledSidebar>

      <StyledNav>
        <NavList>
          <NavLinkStyled to="/" end>Roomies App</NavLinkStyled>
            {user?.admin && (
              <>
                <NavLinkStyled className="hideOnMobile" to="/notifications">Messages</NavLinkStyled>
                <NavLinkStyled className="hideOnMobile" to="/users">Users</NavLinkStyled>
                
                <DropdownContainer className="hideOnMobile">
                  <LinkDropDown 
                    to="/settings/weekdays"
                    className={isSettingsActive ? "active" : ""}>
                      Settings
                  </LinkDropDown>
                  <DropdownContent className="dropdown-content">
                    <DropdownItem to="/settings/weekdays">Weekdays</DropdownItem>
                    <DropdownItem to="/settings/dates">Holidays</DropdownItem>
                  </DropdownContent>
                </DropdownContainer>
              </>
            )}
  
            {user?.admin && (
              <>
                <DropdownContainer className="hideOnMobile">
                  <LinkDropDown to="/rooms">Rooms</LinkDropDown>
                  <DropdownContent className="dropdown-content">
                    <DropdownItem to="/rooms/dates">Individual dates</DropdownItem>
                  </DropdownContent>
                </DropdownContainer>
                <NavLinkStyled className="hideOnMobile" to="/bookings">Bookings</NavLinkStyled>
              </>
            )}
  
            {user && !user.admin && (
              <> 
                <NavLinkStyled className="hideOnMobile" to="/notifications">Messages</NavLinkStyled>
                <NavLinkStyled className="hideOnMobile" to="/rooms">Rooms</NavLinkStyled>
                <NavLinkStyled className="hideOnMobile" to="/bookings">Bookings</NavLinkStyled>
              </>
            )}
        </NavList>
        <NavList>
          {user ? (
            <>
              <NavLinkStyled className="hideOnMobile" to={`/users/${user.id}`} end>{user.name}</NavLinkStyled>
              <NavLinkStyledNoActive className="hideOnMobile" to="/" end onClick={handleSignout}>Sign Out</NavLinkStyledNoActive>
            </>
          ) : (
            <>
              <NavLinkStyled className="hideOnMobile" to="/signin">Sign In</NavLinkStyled>
              <NavLinkStyled className="hideOnMobile" to="/signup">Sign Up</NavLinkStyled>
            </>
          )}
          <NavLinkStyledNoActive 
            className="menu-button"
            to="#"
            onClick={showSidebar}>
            <i className="fa-solid fa-bars"></i>
          </NavLinkStyledNoActive>
        </NavList>
      </StyledNav>
    </>
  )
}

export default Menu