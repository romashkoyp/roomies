import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Wrapper from '../styles/Wrappers'
import { PrimaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import weekdaysService from '../../services/weekday'
import { fetchWeekdays, selectWeekdays } from '../../reducers/weekdayReducer'

const WeekdayUpdateForm = ({ dayOfWeek, onUpdateSuccess }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const weekdays = useSelector(selectWeekdays)
  const weekday = weekdays.find(item => item.dayOfWeek === Number(dayOfWeek))
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [formData, setFormData] = useState({
    availability: weekday.availability,
    time_begin: weekday.timeBegin?.slice(0, -3),
    time_end: weekday.timeEnd?.slice(0, -3),
    day_of_week: weekday.dayOfWeek
  })

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await weekdaysService.updateGlobalWeekday(formData, formData.day_of_week)

    if (result.success) {
      dispatch(fetchWeekdays())
      dispatch(setNotification('Weekday updated successfully!', 'success', 5))
      onUpdateSuccess()
    } else {
      dispatch(fetchWeekdays())
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <h3>Edit global settings for {daysOfWeek[weekday.dayOfWeek]}</h3>
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
            <label htmlFor="time_begin">Time Start:</label>
            <input
              type="time"
              id="time_begin"
              name="time_begin"
              value={formData.time_begin || ''}
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
          <PrimaryButton type="submit">Save</PrimaryButton>
        </form>
      </Wrapper>
    )
  }
}

WeekdayUpdateForm.propTypes = {
  dayOfWeek: PropTypes.string.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired
}

export default WeekdayUpdateForm