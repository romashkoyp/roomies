import { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'

import { fetchGlobalDates } from '../../reducers/globalDateReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import globalDateService from '../../services/globalDate'
import { PrimaryButton } from '../styles/Buttons'
import CloseButtonWrapper from '../styles/CloseButtonWrapper'
import LinkHeader from '../styles/LinkHeader'
import Wrapper from '../styles/Wrapper'

const AllGlobalDatesForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Holiday',
    date: new Date().toISOString().slice(0, 10),
    availability: true,
    time_begin: '09:00',
    time_end: '17:00',
  })

  const handleClick = () => {
    setIsVisible(!isVisible)
  }
  
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    if (name === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)){
      alert('Invalid date format. Use YYYY-MM-DD.')
      return
    }
    setFormData(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { name, date, availability, time_begin, time_end } = formData
    const result = await globalDateService.addGlobalDate({ name, date, availability, time_begin, time_end })

    if (result.success) {
      dispatch(fetchGlobalDates())
      dispatch(setNotification('Holiday added successfully', 'success', 5))
      setFormData({
          name: 'Holiday',
          date: new Date().toISOString().slice(0, 10),
          availability: true,
          time_begin: '09:00',
          time_end: '17:00',
      })
      setIsVisible(false)
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null

  return (
    <Wrapper>
      <CloseButtonWrapper>
        <LinkHeader onClick={handleClick}><h3>Add holiday for all rooms</h3></LinkHeader>
        {isVisible ?
            <i className="fa-solid fa-xmark fa-xl" style={{ cursor: 'pointer'}} onClick={handleClick}></i>
          : null}
      </CloseButtonWrapper>
      <p>
        Simply add days like holidays or company events and set special schedule for all rooms on these days. 
        Middle priority. These settings can be overridden by individual date for special room.
      </p>

      { isVisible ? <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="availability">Availability</label>
          <input
            type="checkbox"
            id="availability"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time_begin">Time Start</label>
          <input
            type="time"
            id="time_begin"
            name="time_begin"
            value={formData.time_begin}
            onChange={handleChange}
            disabled={!formData.availability}
          />
        </div>
          
        <div className="form-group">
          <label htmlFor="time_end">Time End</label>
          <input
            type="time"
            id="time_end"
            name="time_end"
            value={formData.time_end}
            onChange={handleChange}
            disabled={!formData.availability}
          />
        </div>
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>: null}
    </Wrapper>
  )
}

export default AllGlobalDatesForm