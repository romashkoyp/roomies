import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../../reducers/userReducer'
import { selectRooms } from '../../reducers/roomReducer'
import Wrapper from '../styles/Wrapper'
import RoomForm from './NewRoomForm'

const Users = () => {
  const user = useSelector(selectUser)
  const rooms = useSelector(selectRooms)
  const navigate = useNavigate()

  if (!user) return null

  const handleRowClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  }

  if (Array.isArray(rooms) && rooms.length > 0 ) {
    return (
      <>
        {user.admin && user.enabled ? <RoomForm /> : null}
        <Wrapper>
          <h3>Rooms</h3>
          <table>
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((u) => (
                <tr
                  key={u.id}
                  onClick={()=>handleRowClick(u.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.capacity}</td>
                  <td>{u.size}</td>
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
        {user.admin && user.enabled ? <RoomForm /> : null}
        <Wrapper>
          <h3>Rooms</h3>
          <p>No rooms found</p>
        </Wrapper>
      </>
    )
  }
}

export default Users