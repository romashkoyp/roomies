import moment from 'moment'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectIndividualDates, selectIndividualDatesError,selectIndividualDatesLoading } from '../../../reducers/individualDateReducer'
import { selectUser } from '../../../reducers/userReducer'
import useDelayedLoading from '../../../services/delayedLoading'
import Spinner from '../../spinner'
import Wrapper from '../../styles/Wrapper'

const AllDatesView = () => {
  const user = useSelector(selectUser)
  const dates = useSelector(selectIndividualDates)
  const loading = useSelector(selectIndividualDatesLoading)
  const error = useSelector(selectIndividualDatesError)
  const showSpinner = useDelayedLoading(loading)
  const navigate = useNavigate()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const formatTime = (time) => (time ? time.slice(0, -3) : null)

  if (!user) return null

  const handleRowClick = (date, roomId) => {
    navigate(`/rooms/${roomId}/dates/${date}`)
  }

  return (
    <>
      {showSpinner && <Spinner />}
      {!showSpinner && !loading && error && <p>Error: {error}</p>}
      {!showSpinner && !loading && !error &&
        <Wrapper>
          <h3>Individual dates for specific rooms</h3>
          {dates.length == 0 ? <p>No individual dates found.</p> :
            <table>
              <thead>
                <tr>
                  <th>Room name</th>
                  <th>Date</th>
                  <th>Day Of Week</th>
                  <th>Name</th>
                  <th>Availability</th>
                  <th>Time Begin</th>
                  <th>Time End</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((date) => (
                  <tr
                    key={date.id}
                    onClick={() => handleRowClick(date.date, date.roomId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{date.room.name}</td>
                    <td>{moment(date.date).format('MMMM Do, YYYY')}</td>
                    <td>{daysOfWeek[date.dayOfWeek]}</td>
                    <td>{date.name}</td>
                    <td>{date.availability ? 'Yes' : 'No'}</td>
                    <td>{formatTime(date.timeBegin)}</td>
                    <td>{formatTime(date.timeEnd)}</td>
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

export default AllDatesView