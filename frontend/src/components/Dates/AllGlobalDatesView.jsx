import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Wrapper from '../styles/Wrapper'
import AllGlobalDatesForm from './AllGlobalDatesForm'
import { selectUser } from '../../reducers/userReducer'
import { selectGlobalDates, selectGlobalDatesLoading, selectGlobalDatesError } from '../../reducers/globalDateReducer'
import Spinner from '../spinner'
import useDelayedLoading from '../../services/delayedLoading'
import moment from 'moment'

const AllGlobalDatesView = () => {
  const user = useSelector(selectUser)
  const globalDates = useSelector(selectGlobalDates)
  const loading = useSelector(selectGlobalDatesLoading)
  const error = useSelector(selectGlobalDatesError)
  const showSpinner = useDelayedLoading(loading)
  const navigate = useNavigate()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const handleRowClick = (date) => {
    navigate(`/settings/dates/${date}`)
  }

  if (!user) return null

  return (
    <>
      {user.admin && user.enabled && <AllGlobalDatesForm />}
      {showSpinner && <Spinner />}
      {!showSpinner && !loading && error && <p>Error: {error}</p>}
      {!showSpinner && !loading && !error &&
        <Wrapper>
          <h3>Current holidays for all rooms</h3>
          {globalDates.length == 0 ? <p>No holidays found.</p> :
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Name</th>
                  <th>Availability</th>
                  <th>Time Start</th>
                  <th>Time End</th>
                </tr>
              </thead>
              <tbody>
                {globalDates.map((date) => (
                  <tr
                    key={date.id}
                    onClick={() => handleRowClick(date.date)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{moment(date.date).format('MMMM Do, YYYY')}</td>
                    <td>{daysOfWeek[date.dayOfWeek]}</td>
                    <td>{date.name}</td>
                    <td>{date.availability ? 'Yes' : 'No'}</td>
                    <td>{date.timeBegin?.slice(0, -3)}</td>
                    <td>{date.timeEnd?.slice(0, -3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </Wrapper>
      }
    </>
  )
}

export default AllGlobalDatesView