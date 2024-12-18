import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectRooms, selectRoomsError,selectRoomsLoading } from '../../reducers/roomReducer'
import { selectUser } from '../../reducers/userReducer'
import useDelayedLoading from '../../services/delayedLoading'
import Spinner from '../spinner'
import Wrapper from '../styles/Wrapper'
import RoomForm from './NewRoomForm'

const Rooms = () => {
  const user = useSelector(selectUser)
  const rooms = useSelector(selectRooms)
  const loading = useSelector(selectRoomsLoading)
  const error = useSelector(selectRoomsError)
  const showSpinner = useDelayedLoading(loading)
  const navigate = useNavigate()

  if (!user) return null

  const handleRowClick = (roomId) => {
    navigate(`/rooms/${roomId}`)
  }

  return (
    <>
      {user.admin && user.enabled && <RoomForm />}
      {showSpinner && <Spinner />}
      {!showSpinner && !loading && error && <p>Error: {error}</p>}
      {!showSpinner && !loading && !error &&
        <Wrapper>
          <h3>Rooms</h3>
          {rooms.length == 0 ? <p>No rooms found.</p> :
            <table>
              <thead>
                <tr>
                  {user.admin && user.enabled && <th>Room ID</th>}
                  <th>Name</th>
                  <th>Capacity, people</th>
                  <th>Size, m<sup>2</sup></th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((u) => (
                  <tr
                    key={u.id}
                    onClick={()=>handleRowClick(u.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.admin && user.enabled && <td>{u.id}</td>}
                    <td>{u.name}</td>
                    <td>{u.capacity}</td>
                    <td>{u.size}</td>
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

export default Rooms