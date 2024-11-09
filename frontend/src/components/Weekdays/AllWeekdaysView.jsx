import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Wrapper from '../styles/Wrapper'
import AllWeekdaysForm from './AllWeekdaysForm'
import { selectUser } from '../../reducers/userReducer'
import { selectWeekdays, selectWeekdaysLoading, selectWeekdaysError } from '../../reducers/weekdayReducer'
import Spinner from '../spinner'
import useDelayedLoading from '../../services/delayedLoading'

const AllWeekdaysView = () => {
  const user = useSelector(selectUser)
  const weekdays = useSelector(selectWeekdays)
  const loading = useSelector(selectWeekdaysLoading)
  const error = useSelector(selectWeekdaysError)
  const showSpinner = useDelayedLoading(loading)
  const navigate = useNavigate()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const handleRowClick = (dayOfWeek) => {
    navigate(`/settings/weekdays/${dayOfWeek}`)
  }

  if (!user) return null

  if (weekdays.length > 0) {
    return (
      <>
        {user.admin && user.enabled && <AllWeekdaysForm />}
        {showSpinner && <Spinner />}
        {!showSpinner && !loading && error && <p>Error: {error}</p>}
        {!showSpinner && !loading && !error &&
          <Wrapper>
            <h3>Current weekdays for all rooms</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Availability</th>
                  <th>Time Start</th>
                  <th>Time End</th>
                </tr>
              </thead>
              <tbody>
                {weekdays.map((weekday) => (
                  <tr
                    key={weekday.dayOfWeek}
                    onClick={() => handleRowClick(weekday.dayOfWeek)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{daysOfWeek[weekday.dayOfWeek]}</td>
                    <td>{weekday.availability ? 'Yes' : 'No'}</td>
                    <td>{weekday.timeBegin?.slice(0, -3)}</td>
                    <td>{weekday.timeEnd?.slice(0, -3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Wrapper>
        }
      </>
    )
  }
}

export default AllWeekdaysView