import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../../../reducers/userReducer'
import { selectIndividualDates } from '../../../reducers/individualDateReducer'
import Wrapper from '../../styles/Wrapper'


const AllDatesView = () => {
  const user = useSelector(selectUser)
  const dates = useSelector(selectIndividualDates)
  const navigate = useNavigate()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (!user) return null

  const handleRowClick = (date) => {
    navigate(`/rooms/dates/${date}`)
  }

  if (Array.isArray(dates) && dates.length > 0) {
    return (
      <Wrapper>
        <h3>All Dates</h3>
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
                onClick={() => handleRowClick(date.date)}
                style={{ cursor: 'pointer' }}
              >
                <td>{date.room.name}</td>
                <td>{date.date}</td>
                <td>{daysOfWeek[date.dayOfWeek]}</td>
                <td>{date.name}</td>
                <td>{date.availability ? 'Yes' : 'No'}</td>
                <td>{date.timeBegin}</td>
                <td>{date.timeEnd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <h3>All Dates</h3>
        <p>No dates found</p>
      </Wrapper>
    )
  }
}

export default AllDatesView