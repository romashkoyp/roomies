import moment from 'moment'
import PropTypes from 'prop-types'
import { useEffect,useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'

import { fetchBookingsByDate } from '../../reducers/bookingReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { selectUser } from '../../reducers/userReducer'
import bookingService from '../../services/booking'
import { CloseButton,PrimaryButton, SecondaryButton } from '../styles/Buttons'
import Wrapper from '../styles/Wrapper'

const NewBookingForm = ({ slotInfo, onClose, onSubmit, editingBooking }) => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: 'Meeting', 
    date: moment(slotInfo.start).format('YYYY-MM-DD'),
    time_begin: moment(slotInfo.start).format('HH:mm'),
    time_end: moment(slotInfo.end).format('HH:mm'),
    roomId: slotInfo.resourceId,
  })

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        name: editingBooking.name,
        date: editingBooking.date,
        time_begin: editingBooking.timeBegin,
        time_end: editingBooking.timeEnd,
        roomId: editingBooking.roomId,
      })
    }
  }, [editingBooking])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formattedFormData = {
      ...formData,
      time_begin: moment(formData.time_begin, 'HH:mm:ss').format('HH:mm'),
      time_end: moment(formData.time_end, 'HH:mm:ss').format('HH:mm')
    }
    onSubmit(formattedFormData)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const result = await bookingService.deleteBooking(editingBooking.id)
      if (result.success) {
        dispatch(setNotification('Booking deleted successfully', 'success', 5))
        dispatch(fetchBookingsByDate(formData.date))
        onClose()
      } else {
        dispatch(setNotification(result.error, 'error', 5))
      }
    }
  }

  if (!user) return null

  return (
    <Wrapper className="booking-form-popup">
      <CloseButton onClick={onClose} aria-label="Close form">×</CloseButton>
      <h3>{editingBooking ? 'Edit Booking' : 'Create New Booking'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <div className="input-container">
            <input
              className='booking-input'
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <div className="input-container">
            <input
              className='booking-input'
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="time_begin">Start Time:</label>
          <div className="input-container">
            <input
              className='booking-input'
              type="time"
              id="time_begin"
              name="time_begin"
              value={formData.time_begin}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="time_end">End Time:</label>
          <div className="input-container">
            <input
              className='booking-input'
              type="time"
              id="time_end"
              name="time_end"
              value={formData.time_end}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <PrimaryButton type="submit">Submit</PrimaryButton>
        {editingBooking && ( 
          <SecondaryButton type="button" onClick={handleDelete}>Delete</SecondaryButton>
        )}
      </form>
    </Wrapper>
  )
}

NewBookingForm.propTypes = {
  slotInfo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingBooking: PropTypes.object,
}

export default NewBookingForm