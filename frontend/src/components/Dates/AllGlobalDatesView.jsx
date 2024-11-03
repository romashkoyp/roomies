import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Wrapper from '../styles/Wrapper'
import AllGlobalDatesForm from './AllGlobalDatesForm'
import { selectUser } from '../../reducers/userReducer'
import { selectGlobalDates } from '../../reducers/globalDateReducer'

const AllGlobalDatesView = () => {
  const user = useSelector(selectUser)
  const globalDates = useSelector(selectGlobalDates)
  const navigate = useNavigate()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const handleRowClick = (date) => {
    navigate(`/settings/dates/${date}`)
  }

  if (!user) return null

  if (globalDates.length > 0) {
    return (
      <>
        {user.admin && user.enabled ? <AllGlobalDatesForm /> : null}
        <Wrapper>
          <h3>Global Dates for all rooms</h3>
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
                  <td>{date.date}</td>
                  <td>{daysOfWeek[date.dayOfWeek]}</td>
                  <td>{date.name}</td>
                  <td>{date.availability ? 'Yes' : 'No'}</td>
                  <td>{date.timeBegin?.slice(0, -3)}</td>
                  <td>{date.timeEnd?.slice(0, -3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Wrapper>
      </>
    )
  } else {
    return (
      <>
      {user.admin && user.enabled ? <AllGlobalDatesForm /> : null}
        <Wrapper>
          <h3>Global Dates for all rooms</h3>
          <p>No global dates found</p>
        </Wrapper>
      </>
    )
  }
}

export default AllGlobalDatesView