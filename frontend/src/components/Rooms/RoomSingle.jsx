import { useEffect,useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Link,useNavigate, useParams } from 'react-router-dom'

import { setNotification } from '../../reducers/notificationReducer'
import { fetchRooms, selectRooms, selectRoomsError,selectRoomsLoading } from '../../reducers/roomReducer'
import { selectUser } from '../../reducers/userReducer'
import useDelayedLoading from '../../services/delayedLoading'
import roomService from '../../services/room'
import Spinner from '../spinner'
import { PrimaryButton, SecondaryButton } from '../styles/Buttons'
import Wrapper from '../styles/Wrapper'
import RoomUpdateForm from './RoomUpdateForm'

const SingleRoom = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const rooms = useSelector(selectRooms)
  const loading = useSelector(selectRoomsLoading)
  const [imageLoading, setImageLoading] = useState(true)
  const isLoading = loading || imageLoading
  const error = useSelector(selectRoomsError)
  const showSpinner = useDelayedLoading(isLoading)
  const { id } = useParams()
  const currentRoom = rooms.find(item => item.id === Number(id))
  const currentRoomId = Number(id)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (currentRoom) {
      setImageLoading(true)
      const img = new Image()
      img.src = currentRoom.imagePath
      img.onload = () => {
        setImageLoading(false)
      }
      img.onerror = () => {
        setImageLoading(false)
        dispatch(setNotification('Failed to load room image', 'error', 5))
      }
    }
  }, [currentRoom, dispatch])

  if (!user) return null

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  const handleCloseEdit = () => setIsEditMode(false)

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
        {showSpinner && <Spinner />}
        {!showSpinner && !loading && error && <p>Error: {error}</p>}
        {!showSpinner && !isLoading && !error &&
          <>
            <Wrapper>
              <h3>{currentRoom.name}</h3>
              <a href={currentRoom.imagePath}>
                <img
                  src={currentRoom.imagePath}
                  alt="picture of room"
                />
              </a>
              <table>
                <tbody>
                {user.admin && user.enabled &&
                  <tr>
                    <th width="150px">Room ID</th>
                    <td>{currentRoom.id}</td>
                  </tr>
                }
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
                  {user.admin && user.enabled &&
                    <>
                      <tr>
                        <th>Image Path</th>
                        <td><Link to={currentRoom.imagePath} target='_blank'>Link to image</Link></td>
                      </tr>
                      <tr>
                        <th>Individual Dates</th>
                        <td><Link to={`/rooms/${currentRoom.id}/dates`}>Link to dates availability</Link></td>
                      </tr>
                    </>
                  }
                </tbody>
              </table>
            
              {user.admin && user.enabled &&
                <>
                  <PrimaryButton onClick={handleEditClick}>
                    {isEditMode ? 'Cancel' : 'Edit'}
                  </PrimaryButton>
                  <SecondaryButton onClick={handleDeleteRoom}>
                    Delete
                  </SecondaryButton>
                </>
              }
            </Wrapper>

            {isEditMode && user.admin && user.enabled &&
              <RoomUpdateForm
                id={currentRoomId}
                onUpdateSuccess={handleUpdateSuccess}
                onCloseEdit={handleCloseEdit}
              />
            }
          </>
        }
      </>
    )
  }
}

export default SingleRoom