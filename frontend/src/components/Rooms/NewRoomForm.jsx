import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Wrapper from '../styles/Wrapper'
import { PrimaryButton } from '../styles/Buttons'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import roomService from '../../services/room'
import { fetchRooms } from '../../reducers/roomReducer'
import LinkHeader from '../styles/LinkHeader'
import CloseButtonWrapper from '../styles/CloseButtonWrapper'

const RoomForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: 'air',
    capacity: 12,
    size: 25,
    image_path: 'https://media.istockphoto.com/id/1323139676/fi/valokuva/tyhj%C3%A4n-kokoushuoneen-ulkon%C3%A4kym%C3%A4-p%C3%B6yt%C3%A4-ja-toimistotuoleilla.jpg?s=2048x2048&w=is&k=20&c=a5KSG8aAxjem7T8EWyLbpCadh-bgKcxqwYB1uOlRzJY='
  })

  const handleClick = () => {
    setIsVisible(!isVisible)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { name, capacity, size, image_path } = formData
    const result = await roomService.addRoom({ name, capacity, size, image_path })

    if (result.success) {
      dispatch(fetchRooms())
      dispatch(setNotification('Room created', 'success', 5))
      setFormData({
        name: '',
        capacity: '',
        size: '',
        image_path: ''
      })
      setIsVisible(false)
    } else {
      dispatch(fetchRooms())
      dispatch(setNotification(result.error, 'error', 5))
    }
  }

  if (user === undefined) return null
  
  if (user?.admin && user.enabled) {
    return (
      <Wrapper>
        <CloseButtonWrapper>
          <LinkHeader onClick={handleClick}><h3>Add new room</h3></LinkHeader>
          {isVisible ?
            <i className="fa-solid fa-xmark fa-xl" style={{ cursor: 'pointer'}} onClick={handleClick}></i>
          : null}
        </CloseButtonWrapper>
        
        {isVisible ?
          <form onSubmit={handleSubmit}>   
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="capacity">Capacity, people</label>
              <input
                type="number"
                min="1"
                placeholder="50"
                name="capacity"
                id="capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="size">Size, m<sup>2</sup></label>
              <input
                type="number"
                min="1"
                id="size"
                name="size"
                placeholder="100"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="url">Image Path, url</label>
              <input
                type="url"
                id="url"
                name="image_path"
                value={formData.image_path}
                onChange={handleChange}
              />
            </div>
            
            <PrimaryButton type="submit">Submit</PrimaryButton>
          </form>
          : null}
      </Wrapper>
    )
  }
}

export default RoomForm