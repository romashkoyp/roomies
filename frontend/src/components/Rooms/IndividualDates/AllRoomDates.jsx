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
  const formatTime = (time) => (time ? time.slice(0, -3) : null)

  if (!user || !currentRoom) return null

  const handleRowClick = (date) => {
    navigate(`/rooms/${currentRoom.id}/dates/${date}`)
  }

  if (individualDatesForRoom?.length > 0) {
    return (
      <>
        {user.admin && user.enabled ? <NewDateForm /> : null}
        <Wrapper>
          <h3>Individual dates for {currentRoom.name} room</h3>
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
                  <td>{formatTime(date.timeBegin)}</td>
                  <td>{formatTime(date.timeEnd)}</td>
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
        {user.admin && user.enabled ? <NewDateForm /> : null}
        <Wrapper>
          <h3>Individual dates for {currentRoom.name} room</h3>
          <p>No individual dates found for {currentRoom.name} room.</p>
      </Wrapper>
    </>
  )}
}

export default AllRoomDates