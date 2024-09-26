import { useSelector } from 'react-redux'
import { selectUser } from '../../../reducers/userReducer'
import { useNavigate } from 'react-router-dom'
import { selectCurrentRoom } from '../../../reducers/roomReducer'
import { selectIndividualDatesForRoom } from '../../../reducers/individualDateReducer'
import Wrapper from '../../styles/Wrapper'
import NewDateForm from './NewDateForm'

const AllRoomDates = () => {
  const user = useSelector(selectUser)
  const currentRoom = useSelector(selectCurrentRoom)
  const individualDatesForRoom = useSelector(selectIndividualDatesForRoom)
  const navigate = useNavigate()

  if (!user || !currentRoom) return null

  const handleRowClick = (date) => {
    navigate(`/rooms/${currentRoom.id}/dates/${date}`)
  }

  console.log(individualDatesForRoom)

  if ((Array.isArray(individualDatesForRoom))) {
    return (
      <>
        {user.admin && user.enabled ? <NewDateForm /> : null}
        <Wrapper>
          <h3>Dates for {currentRoom.name}</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Availability</th>
                <th>Time Start</th>
                <th>Time End</th>
              </tr>
            </thead>
            <tbody>
              {individualDatesForRoom.map((date) => (
                <tr
                  key={date.id}
                  onClick={() => handleRowClick(date.date)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{date.date}</td>
                  <td>{date.name}</td>
                  <td>{date.availability ? 'Yes' : 'No'}</td>
                  <td>{date.timeBegin}</td>
                  <td>{date.timeEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Wrapper>
      </>
    )
  } else {
      <Wrapper>
        <h3>Dates for {currentRoom.name}</h3>
        <p>No individual dates found for this room.</p>
    </Wrapper>
  }
}

export default AllRoomDates