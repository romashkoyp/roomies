import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectUser } from '../../reducers/userReducer'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton } from '../styles/Buttons'
import WeekdayUpdateForm from './WeekdayUpdateForm'
import { SecondaryButton } from '../styles/Buttons'
import weekdaysService from '../../services/weekday'
import { fetchWeekdays, selectWeekdays } from '../../reducers/weekdayReducer'
import { setNotification } from '../../reducers/notificationReducer'

const WeekdaySingle = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const { dayOfWeek } = useParams()
  const weekdays = useSelector(selectWeekdays)
  const weekday = weekdays.find(item => item.dayOfWeek === Number(dayOfWeek))
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const formatTime = (time) => (time ? time.slice(0, -3) : null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  if (!user || !weekday) return null

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  const handleUpdateSuccess = () => {
    setIsEditMode(false)
  }

  const handleCloseEdit = () => {
    setIsEditMode(false)
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    if (confirm("Are you sure?")) {
      const result = await weekdaysService.deleteWeekday(weekday.dayOfWeek)
      if (result.success) {
        dispatch(fetchWeekdays())
        dispatch(setNotification('Weekday settings restored to default', 'success', 5))
      } else {
        dispatch(fetchWeekdays())
        dispatch(setNotification(result.error, 'error', 5))
      }
    } else return null
  }

  return (
    <>
      <Wrapper>
        <h3>Global settings for {daysOfWeek[weekday.dayOfWeek]}</h3>
        <table>
          <tbody>
            <tr>
              <th>Day</th>
              <td>{daysOfWeek[weekday.dayOfWeek]}</td>
            </tr>
            <tr>
              <th>Availability</th>
              <td>{weekday.availability ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th>Time Start</th>
              <td>{formatTime(weekday.timeBegin)}</td>
            </tr>
            <tr>
              <th>Time End</th>
              <td>{formatTime(weekday.timeEnd)}</td>
            </tr>
          </tbody>
        </table>
        {user.admin && user.enabled &&
        <>
          <PrimaryButton onClick={handleEditClick}>
            {isEditMode ? 'Cancel' : 'Edit'}
          </PrimaryButton>
          <SecondaryButton onClick={handleDelete}>
            Restore
          </SecondaryButton>
        </>
        }
      </Wrapper>
        {isEditMode && user.admin && user.enabled &&
          <WeekdayUpdateForm
            dayOfWeek={dayOfWeek}
            onUpdateSuccess={handleUpdateSuccess}
            onCloseEdit={handleCloseEdit}
          />
        }
    </>
  )
}

export default WeekdaySingle