import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton, SecondaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import weekdaysService from '../../services/weekday'
import { fetchWeekdays } from '../../reducers/weekdayReducer'
import LinkHeader from '../styles/LinkHeader'
import CloseButtonWrapper from '../styles/CloseButtonWrapper'

const AllWeekdaysForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [formData, setFormData] = useState({
    availability: true,
    time_begin: '09:00',
    time_end: '17:00',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await weekdaysService.updateGlobalWeekdays(formData)

    if (result.success) {
      dispatch(fetchWeekdays())
      dispatch(setNotification('Weekdays updated successfully!', 'success', 5))
      setFormData({
        availability: true,
        time_begin: '09:00',
        time_end: '17:00',
      })
      setIsVisible(false)
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
  
    if (name === 'availability') {
      setFormData(prevData => ({
        ...prevData,
        availability: checked,
        time_begin: checked ? prevData.time_begin : '',
        time_end: checked ? prevData.time_end : ''
      }))
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const [isVisible, setIsVisible] = useState(false)

  const handleClick = () => {
    setIsVisible(!isVisible)
  }

  const handleDeleteWeekdays = async (event) => {
    event.preventDefault()
    if (confirm("This action restored all weekdays settings to default values. Are you sure to continue?")) {    
      const result = await weekdaysService.deleteWeekdays()
      if (result.success) {
        dispatch(fetchWeekdays())
        setIsVisible(false)
        dispatch(setNotification('Global weekdays settings restored', 'success', 5))
      } else {
        dispatch(fetchWeekdays())
        dispatch(setNotification(result.error, 'error', 5))
      }
    } else return null
  }

  if (user === undefined || !user.admin || !user.enabled) { 
    return null
  }

  return (
    <Wrapper>
      <CloseButtonWrapper>
        <LinkHeader onClick={handleClick}><h3>Edit global weekdays for all rooms</h3></LinkHeader>
        {isVisible ?
            <i className="fa-solid fa-xmark fa-xl" style={{ cursor: 'pointer'}} onClick={handleClick}></i>
          : null}
      </CloseButtonWrapper>
      
      {isVisible && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="availability">Availability:</label>
            <input
              type="checkbox"
              id="availability"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time_begin">Time Begin:</label>
            <input
              type="time"
              id="time_begin"
              name="time_begin"
              value={(formData.time_begin || '')}
              onChange={handleChange}
              disabled={!formData.availability}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time_end">Time End:</label>
            <input
              type="time"
              id="time_end"
              name="time_end"
              value={(formData.time_end || '')}
              onChange={handleChange}
              disabled={!formData.availability}
            />
          </div>
          <>
            <PrimaryButton type="submit">Submit</PrimaryButton>
            <SecondaryButton onClick={handleDeleteWeekdays}>Restore</SecondaryButton>
          </>
        </form>
      )}
    </Wrapper>
  )
}

export default AllWeekdaysForm