import moment from 'moment'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { selectIndividualDatesForRoom, selectIndividualDatesForRoomError,selectIndividualDatesForRoomLoading } from '../../../reducers/individualDateReducer'
import { selectRooms } from '../../../reducers/roomReducer'
import { selectUser } from '../../../reducers/userReducer'
import useDelayedLoading from '../../../services/delayedLoading'
import Spinner from '../../spinner'
import Wrapper from '../../styles/Wrapper'
import NewDateForm from './NewDateForm'

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

    return (
      <>
        {user.admin && user.enabled && <NewDateForm />}
        {showSpinner && <Spinner />}
        {!showSpinner && !loading && error && <p>Error: {error}</p>}
        {!showSpinner && !loading && !error &&
          <Wrapper>
            <h3>Individual dates for {currentRoom.name}</h3>
            {individualDatesForRoom.length == 0 ? <p>No individual dates found for current room.</p> :
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
            }
          </Wrapper>
        }
      </>
    )

}

export default AllRoomDates