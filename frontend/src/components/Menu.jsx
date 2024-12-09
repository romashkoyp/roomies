import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import signinService from '../services/signin'
import StyledSidebar from './styles/Sidebar'

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 870px) {
    font-size: initial;
  }
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
  
  const showSidebar = async () => {
    setSidebarVisible(!sidebarVisible)
  }

  const handleSignout = async () => {
    if (confirm("Are you sure?")) {
      setSidebarVisible(false)
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
          <NavLinkStyled className='sidebar-li' to="/" end onClick={showSidebar}>Roomies App</NavLinkStyled>
            {user?.admin && (
              <>
                <NavLinkStyled className='sidebar-li' to="/notifications" onClick={showSidebar}>Messages</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/users" onClick={showSidebar}>Users</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/settings/weekdays" onClick={showSidebar}>Weekdays</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/settings/dates" onClick={showSidebar}>Holidays</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/rooms" onClick={showSidebar}>Rooms</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/rooms/dates" onClick={showSidebar}>Individual dates</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/bookings" onClick={showSidebar}>Bookings</NavLinkStyled>
              </>
            )}

            {user && !user.admin && (
              <> 
                <NavLinkStyled className='sidebar-li' to="/notifications" onClick={showSidebar}>Messages</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/rooms" onClick={showSidebar}>Rooms</NavLinkStyled>
                <NavLinkStyled className='sidebar-li' to="/bookings" onClick={showSidebar}>Bookings</NavLinkStyled>
              </>
            )}
        
        
          {user ? (
            <>
              <NavLinkStyled className='sidebar-li' to={`/users/${user.id}`} end onClick={showSidebar}>{user.name}</NavLinkStyled>
              <NavLinkStyledNoActive className='sidebar-li' to="/" end onClick={handleSignout}>Sign Out</NavLinkStyledNoActive>
            </>
          ) : (
            <>
              <NavLinkStyled className='sidebar-li' to="/signin" onClick={showSidebar}>Sign In</NavLinkStyled>
              <NavLinkStyled className='sidebar-li' to="/signup" onClick={showSidebar}>Sign Up</NavLinkStyled>
            </>
          )}
        </NavList>
      </StyledSidebar>

      <StyledNav>
        <NavList>
          <NavLinkStyled 
            to="/" end>
              <i style={{ paddingRight: '0.5em' }} className="fa-solid fa-house" />
              Roomies App
          </NavLinkStyled>
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
              <NavLinkStyled className="hideOnMobile" to={`/users/${user.id}`} end>
                <i style={{ paddingRight: '0.5em' }} className="fa-solid fa-user-tie" />
                {user.name}
              </NavLinkStyled>
              <NavLinkStyledNoActive className="hideOnMobile" to="/" end onClick={handleSignout}>
                <i style={{ paddingRight: '0.5em' }} className="fa-solid fa-arrow-right-from-bracket" />
                Sign Out
              </NavLinkStyledNoActive>
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