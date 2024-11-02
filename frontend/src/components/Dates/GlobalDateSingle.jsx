import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { selectUser } from '../../reducers/userReducer'
import { selectGlobalDates } from '../../reducers/globalDateReducer'
import Wrapper from '../styles/Wrappers'
import { SecondaryButton } from '../styles/Buttons'
import globalDateService from '../../services/globalDate'
import { setNotification } from '../../reducers/notificationReducer'
import { fetchGlobalDates } from '../../reducers/globalDateReducer'

const GlobalDateSingle = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { date } = useParams()
  const globalDates = useSelector(selectGlobalDates)
  const currentGlobalDate = globalDates.find(item => item.date === date)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const formatTime = (time) => (time ? time.slice(0, -3) : null)

  if (!user || !currentGlobalDate) return null

  const handleDeleteDate = async (event) => {
    event.preventDefault()
    if (confirm("Are you sure?")) {
      const result = await globalDateService.deleteGlobalDate(date)
      if (result.success) {
        dispatch(fetchGlobalDates())
        dispatch(setNotification('Date deleted', 'success', 5))
        navigate(`/settings/dates`)
      } else {
        dispatch(setNotification(result.error, 'error', 5))
      }
    }
  }

  return (
    <Wrapper>
      <h3>Global date </h3>
      <table>
        <tbody>
          <tr>
            <th>Date</th>
            <td>{currentGlobalDate.date}</td>
          </tr>
          <tr>
            <th>Day Of Week</th>
            <td>{daysOfWeek[currentGlobalDate.dayOfWeek]}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{currentGlobalDate.name}</td>
          </tr>
          <tr>
            <th>Availability</th>
            <td>{currentGlobalDate.availability ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Time Start</th>
            <td>{formatTime(currentGlobalDate.timeBegin)}</td>
          </tr>
          <tr>
            <th>Time End</th>
            <td>{formatTime(currentGlobalDate.timeEnd)}</td>
          </tr>
        </tbody>
      </table>
      {user.admin && user.enabled ? (
        <SecondaryButton onClick={handleDeleteDate}>Delete</SecondaryButton>
      ) : null}
    </Wrapper>
  )
}

export default GlobalDateSingle