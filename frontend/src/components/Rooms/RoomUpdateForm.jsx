import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import roomService from '../../services/room'
import { selectCurrentRoom, fetchRoom, fetchRooms } from '../../reducers/roomReducer'

const RoomUpdateForm = ({ id, onUpdateSuccess }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const currentRoom = useSelector(selectCurrentRoom)
  const [formData, setFormData] = useState({})
  const [originalData, setOriginalData] = useState({})

  useEffect(() => {
    if (!currentRoom) {
      dispatch(fetchRoom(id))
    } else {
      setFormData(currentRoom)
      setOriginalData(currentRoom)
    }
  }, [currentRoom, dispatch, id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const updatedFields = {}
    Object.keys(formData).forEach(key => {
      if (formData[key] !== originalData[key]) {
        updatedFields[key] = formData[key]
      }
    })

    const result = await roomService.updateRoom(
      id,
      updatedFields.name,
      updatedFields.capacity,
      updatedFields.size,
      updatedFields.imagePath)

    if (result.success) {
      dispatch(fetchRoom(id))
      dispatch(fetchRooms())
      dispatch(setNotification('Room updated', 'success', 5))
      onUpdateSuccess()
    } else {
      dispatch(fetchRooms())
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <h3>Edit current room</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="name"
              name="name"
              id="name"
              value={(formData.name || '')}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="capacity">Capacity, people</label>
            <input
              type="number"
              min="2"
              id="capacity"
              name="capacity"
              placeholder="50"
              value={(formData.capacity || '')}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="size">Size, m<sup>2</sup></label>
            <input
              type="number"
              id="size"
              name="size"
              placeholder="50"
              value={(formData.size || '')}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="url">Image Path, url</label>
            <input
              type="url"
              id="url"
              name="imagePath"
              value={formData.imagePath || ''}
              onChange={handleChange}
            />
          </div>
          
          <PrimaryButton type="submit">Save</PrimaryButton>
        </form>
      </Wrapper>
    )
  }
}

RoomUpdateForm.propTypes = {
  id: PropTypes.number.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired
}

export default RoomUpdateForm