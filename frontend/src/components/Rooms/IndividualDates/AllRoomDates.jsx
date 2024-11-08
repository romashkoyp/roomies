import { useSelector } from 'react-redux'
import { selectUser } from '../../../reducers/userReducer'
import { useNavigate, useParams } from 'react-router-dom'
import { selectRooms } from '../../../reducers/roomReducer'
import { selectIndividualDatesForRoom, selectIndividualDatesForRoomLoading, selectIndividualDatesForRoomError } from '../../../reducers/individualDateReducer'
import Wrapper from '../../styles/Wrapper'
import Spinner from '../../spinner'
import useDelayedLoading from '../../../services/delayedLoading'
import NewDateForm from './NewDateForm'
import moment from 'moment'

const AllRoomDates = () => {
  const user = useSelector(selectUser)
  const rooms = useSelector(selectRooms)
  const { id } = useParams()
  const currentRoom = rooms.find(item => item.id == Number(id))
  const individualDatesForRoom = useSelector(selectIndividualDatesForRoom)
  const loading = useSelector(selectIndividualDatesForRoomLoading)
  const error = useSelector(selectIndividualDatesForRoomError)
  const showSpinner = useDelayedLoading(loading)
  const navigate = useNavigate()
  const formatTime = (time) => (time ? time.slice(0, -3) : null)

  if (!user || !currentRoom) return null

  const handleRowClick = (date) => {
    navigate(`/rooms/${currentRoom.id}/dates/${date}`)
  }

  if (individualDatesForRoom?.length > 0) {
    return (
      <>
        {user.admin && user.enabled && <NewDateForm />}
        {showSpinner && <Spinner />}
        {!showSpinner && !loading && error && <p>Error: {error}</p>}
        {!showSpinner && !loading && !error &&
          <Wrapper>
            <h3>Individual dates for {currentRoom.name}</h3>
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
                    <td>{moment(date.date).format('MMMM Do, YYYY')}</td>
                    <td>{date.name}</td>
                    <td>{date.availability ? 'Yes' : 'No'}</td>
                    <td>{formatTime(date.timeBegin)}</td>
                    <td>{formatTime(date.timeEnd)}</td>
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

export default AllRoomDates