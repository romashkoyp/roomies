import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import roomService from '../../services/room'
import Input from '../styles/Input'
import { selectCurrentRoom, fetchRoom, updateRoom, fetchRooms } from '../../reducers/roomReducer'

const RoomUpdateForm = ({ id, onUpdateSuccess }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const currentRoom = useSelector(selectCurrentRoom)
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    size: '',
    imagePath: ''
  })
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
    const { name, value, type } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type, value
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
      dispatch(updateRoom(result.data))
      dispatch(fetchRoom(id))
      dispatch(fetchRooms())
      dispatch(setNotification('Room updated', 'success', 5))
      onUpdateSuccess()
    } else {
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <h3>Edit current room</h3>
        <form onSubmit={handleSubmit}>
          <div>
            Name:
            <Input
              type="text"
              placeholder="name"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            Capacity:
            <Input
              type="number"
              id="capacity"
              name="capacity"
              placeholder="20"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>
          <div>
            Size:
            <Input
              type="number"
              id="size"
              name="size"
              placeholder="50"
              value={formData.size}
              onChange={handleChange}
            />
          </div>
          <div>
            Image Path:
            <Input
              type="text"
              id="image path"
              name="mage path"
              value={formData.imagePath}
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