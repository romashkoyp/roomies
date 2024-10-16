import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { selectUser } from '../../reducers/userReducer'
import { fetchRooms, selectRooms } from '../../reducers/roomReducer'
import RoomUpdateForm from './RoomUpdateForm'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton, SecondaryButton } from '../styles/Buttons'
import roomService from '../../services/room'
import { setNotification } from '../../reducers/notificationReducer'

const SingleRoom = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const rooms = useSelector(selectRooms)
  const { id } = useParams()
  const currentRoom = rooms.find(item => item.id === Number(id))
  const currentRoomId = Number(id)
  const [isEditMode, setIsEditMode] = useState(false)

  if (!user) return null

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  const handleUpdateSuccess = () => {
    setIsEditMode(false)
  }

  const handleDeleteRoom = async (event) => {
    event.preventDefault()
    if (confirm("Are you sure?")) {    
      const result = await roomService.deleteRoom(id)
      if (result.success) {
        dispatch(fetchRooms())
        navigate('/rooms')
        dispatch(setNotification('Room deleted', 'success', 5))
      } else {
        dispatch(fetchRooms())
        dispatch(setNotification(result.error, 'error', 5))
      }
    } else return null
  }
  
  if (currentRoom) {
    return (
      <>
        <Wrapper>
          <h3>Current room is {currentRoom.name}</h3>
          <a href={currentRoom.imagePath}>
            <img src={currentRoom.imagePath} alt="picture of room" ></img>
          </a>
          <table>
            <tbody>
              <tr>
                <th width="150px">Room ID</th>
                <td>{currentRoom.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{currentRoom.name}</td>
              </tr>
              <tr>
                <th>Capacity</th>
                <td>{currentRoom.capacity} people</td>
              </tr>
              <tr>
                <th>Size</th>
                <td>{currentRoom.size} m<sup>2</sup></td>
              </tr>
              <tr>
                <th>Image Path</th>
                <td><Link to={currentRoom.imagePath} target='_blank'>Link to image</Link></td>
              </tr>
              <tr>
                <th>Individual Dates</th>
                <td><Link to={`/rooms/${currentRoom.id}/dates`}>Link to dates availability</Link></td>
              </tr>
            </tbody>
          </table>
        
          {user.admin && user.enabled ?
            <>
              <PrimaryButton onClick={handleEditClick}>
                {isEditMode ? 'Cancel' : 'Edit'}
              </PrimaryButton>
              <SecondaryButton onClick={handleDeleteRoom}>
                Delete
              </SecondaryButton>
            </>
          : null}
        </Wrapper>

        {isEditMode && user.admin && user.enabled ?
          <RoomUpdateForm
            id={currentRoomId}
            onUpdateSuccess={handleUpdateSuccess}
          />
        : null}
      </>
    )
  } else {
    return (
      <Wrapper>
        <h3>Current room</h3>
        <p>No room found</p>
      </Wrapper>
    )
  }
}

export default SingleRoom