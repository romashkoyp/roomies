import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useSelector, useDispatch } from 'react-redux'
import { selectBookings, fetchBookingsByDate } from '../../reducers/bookingReducer'
import { selectUser } from '../../reducers/userReducer'
import bookingService from '../../services/booking'
import { setNotification } from '../../reducers/notificationReducer'
import NewBookingForm from './NewBookingForm'

const BookingCalendar = () => {
  const dispatch = useDispatch()
  const localizer = momentLocalizer(moment)
  const user = useSelector(selectUser)
  const bookings = useSelector(selectBookings)
  const [events, setEvents] = useState([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [editingBooking, setEditingBooking] = useState(null)

  useEffect(() => {
    const events = bookings.flatMap(room => 
      room.bookings.map(booking => ({
        title: `${booking.name}`, 
        start: moment(`${booking.date} ${booking.timeBegin}`).toDate(),
        end: moment(`${booking.date} ${booking.timeEnd}`).toDate(),
        resourceId: room.id,
        bookingId: booking.id
      }))
    )
    setEvents(events)
  }, [bookings])

  const resources = bookings.map(room => ({
    id: room.id,
    title: `Room - ${room.name}`,
  }))

  const handleSelectEvent = (event) => {
    const bookingToUpdate = bookings.flatMap(room => room.bookings).find(
      booking => booking.id === event.bookingId
    )

    if (bookingToUpdate) {
      setEditingBooking(bookingToUpdate)
      setSelectedSlot({
        start: event.start,
        end: event.end,
        resourceId: event.resourceId,
      })
      setShowBookingForm(true)
    }
  }

  const handleSelectSlot = (slotInfo) => {
    setEditingBooking(null)
    setSelectedSlot(slotInfo)
    setShowBookingForm(true)
  }

  const handleBookingFormClose = () => {
    setShowBookingForm(false)
    setSelectedSlot(null)
    setEditingBooking(null)
  }

  const handleBookingSubmit = async (formData) => {
    if (editingBooking) {
      const result = await bookingService.changeBooking({
        ...formData,
        id: editingBooking.id,
        room_id: formData.roomId,
      })

      if (result.success) {dispatch(setNotification('Booking updated successfully!', 'success', 5))
        dispatch(fetchBookingsByDate(formData.date)) 
      } else {
        dispatch(setNotification(result.error, 'error', 5))
      }
    } else {
      const result = await bookingService.addBooking({
        ...formData,
        room_id: formData.roomId, 
      })

      if (result.success) {
        dispatch(setNotification('Booking created successfully!', 'success', 5))
        dispatch(fetchBookingsByDate(formData.date))
      } else {
        dispatch(setNotification(result.error, 'error', 5))
      }
    }
    handleBookingFormClose()
  }

  if (!user) return null

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        resources={resources}
        resourceAccessor="resourceId"
        startAccessor="start"
        endAccessor="end"
        defaultView="day"
        views={['day']}
        step={30}
        min={moment().hours(8).minutes(0).toDate()} // visibility of hours
        max={moment().hours(20).minutes(0).toDate()}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
      />

      {showBookingForm && selectedSlot && (
        <div className="overlay">
          <NewBookingForm
            slotInfo={selectedSlot}
            onClose={handleBookingFormClose}
            onSubmit={handleBookingSubmit}
            editingBooking={editingBooking}
          />
        </div>
      )}
    </div>
  )
}

export default BookingCalendar