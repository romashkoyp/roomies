import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useSelector, useDispatch } from 'react-redux'
import { selectBookings, selectBookingsLoading, selectBookingsError, fetchBookingsByDate } from '../../reducers/bookingReducer'
import { selectUser } from '../../reducers/userReducer'
import bookingService from '../../services/booking'
import { setNotification } from '../../reducers/notificationReducer'
import NewBookingForm from './NewBookingForm'
import Spinner from '../spinner'
import useDelayedLoading from '../../services/delayedLoading'

const getSlotPropGetter = (resources) => {
  return (date, resource) => {
    const room = resources.find((r) => r.id === resource)
    if (!room) return {}
    const slotTime = moment(date)
    let isUnavailable = false
    
    if (room?.settingsTimeBegin && room?.settingsTimeEnd) {
      const roomStart = moment(date).set({ hour: room.settingsTimeBegin.split(':')[0], minute: room.settingsTimeBegin.split(':')[1] })
      const roomEnd = moment(date).set({ hour: room.settingsTimeEnd.split(':')[0], minute: room.settingsTimeEnd.split(':')[1] })
      isUnavailable = slotTime.isBefore(roomStart) || slotTime.isSameOrAfter(roomEnd)
    } else {
      isUnavailable = room.availability
    }
    
    if (isUnavailable || !room.availability) {
      isUnavailable = true
    }

    if (isUnavailable) {
      return {
        style: {
          backgroundColor: 'red',
          opacity: 0.2,
        },
      }
    }
    return {
      style: {
        backgroundColor: 'white',
        opacity: 1,
      },
    }
  }
}

const eventStyleGetter = (event, user) => {
  const isMyEvent = event.eventOwner === user.id
  return {
    style: {
      backgroundColor: isMyEvent ? '#4CAF50' : '#9E9E9E',
      borderColor: isMyEvent ? '#2E7D32' : '#757575',
      color: 'white'
    }
  }
}

const BookingCalendar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'))
  const localizer = momentLocalizer(moment)
  const DnDCalendar = withDragAndDrop(Calendar)
  const user = useSelector(selectUser)
  const bookings = useSelector(selectBookings)
  const loading = useSelector(selectBookingsLoading)
  const error = useSelector(selectBookingsError)
  const showSpinner = useDelayedLoading(loading)
  const [events, setEvents] = useState([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [editingBooking, setEditingBooking] = useState(null)

  useEffect(() => {
    if (user?.enabled) {
      dispatch(fetchBookingsByDate(currentDate))
    }
  }, [currentDate, dispatch, user])

  useEffect(() => {
    const events = bookings.flatMap(room => 
      room.bookings.map(booking => ({
        title: user.id === booking.userId ? `My event "${booking.name}"` : `${booking.name}`,
        start: moment(`${booking.date} ${booking.timeBegin}`).toDate(),
        end: moment(`${booking.date} ${booking.timeEnd}`).toDate(),
        resourceId: room.id,
        bookingId: booking.id,
        eventOwner: booking.userId,
      }))
    )
    setEvents(events)
  }, [bookings, user])
  
  const resources = bookings.map(room => ({
    id: room.id,
    title: room.name,
    settingsTimeBegin: room.settings.timeBegin,
    settingsTimeEnd: room.settings.timeEnd,
    availability: room.settings.availability
  }))

  useEffect(() => {
    const resourceHeaders = document.querySelectorAll('.rbc-row-resource')
    resourceHeaders.forEach((header, index) => {
      const resource = resources[index]
      if (resource) {
        header.setAttribute('resource-id', resource.id)
        header.style.cursor = 'pointer'
        header.onclick = () => {
          const resourceId = header.getAttribute('resource-id')
          handleResourceClick(resourceId)
        }
      }
    })
  }, [resources])

  const handleDateChange = (newDate) => {
    setCurrentDate(moment(newDate).format('YYYY-MM-DD'))
  }

  const handleResourceClick = (resourceId) => {
    navigate(`/rooms/${resourceId}`)
  }

  const handleSelectEvent = (event) => {
    const bookingToUpdate = bookings.flatMap(room => room.bookings).find(
      booking => booking.id === event.bookingId
    )

    if (user.admin || user.id === event.eventOwner) {
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

      if (result.success) {
        dispatch(setNotification('Booking updated successfully!', 'success', 5))
        dispatch(fetchBookingsByDate(currentDate))
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
        dispatch(fetchBookingsByDate(currentDate))
      } else {
        dispatch(setNotification(result.error, 'error', 5))
      }
    }
    handleBookingFormClose()
  }

  const moveEvent = async ({ event, start, end, resourceId }) => {
    const originalBooking = bookings.flatMap(room => room.bookings).find(booking => booking.id === event.bookingId)
    console.log(originalBooking.userId)

    if (user.admin || user.id === event.eventOwner) {
      if (originalBooking.roomId !== resourceId) {
        const newBookingData = {
          name: originalBooking.name,
          date: moment(start).format('YYYY-MM-DD'),
          time_begin: moment(start).format('HH:mm'),
          time_end: moment(end).format('HH:mm'),
          room_id: resourceId,
          user_id: originalBooking.userId
        }

        const createResult = await bookingService.addBooking(newBookingData)
        if (!createResult.success) {
          dispatch(setNotification(createResult.error, 'error', 5))
          return
        }
        
        const deleteResult = await bookingService.deleteBooking(originalBooking.id)
        if (!deleteResult.success) {
          dispatch(setNotification(deleteResult.error, 'error', 5))
          return
        }
        dispatch(fetchBookingsByDate(moment(start).format('YYYY-MM-DD')))
        dispatch(setNotification('Booking moved successfully!', 'success', 5))
      } else {
          const updatedBooking = {
            ...bookings.flatMap(room => room.bookings).find(booking => booking.id === event.bookingId),
            date: moment(start).format('YYYY-MM-DD'),
            time_begin: moment(start).format('HH:mm'),
            time_end: moment(end).format('HH:mm')
          }
        
        const result = await bookingService.changeBooking({...updatedBooking})

        if (result.success) {
          dispatch(setNotification('Booking moved successfully!', 'success', 5))
          dispatch(fetchBookingsByDate(updatedBooking.date))
        } else {
          dispatch(setNotification(result.error, 'error', 5))
        }
      }
    } else {
      dispatch(setNotification('You can change only your own event', 'error', 5))
    }
  }

  const resizeEvent = async ({ event, start, end }) => {
    const bookingToResize = bookings.flatMap(room => room.bookings).find(
      booking => booking.id === event.bookingId
    )

    if (user.admin || user.id === event.eventOwner) {
      if (bookingToResize) {
        const updatedBooking = {
          ...bookingToResize,
          date: moment(start).format('YYYY-MM-DD'),
          time_begin: moment(start).format('HH:mm'),
          time_end: moment(end).format('HH:mm')
        }

        const result = await bookingService.changeBooking({...updatedBooking})

        if (result.success) {
          dispatch(setNotification('Booking duration updated successfully!', 'success', 5))
          dispatch(fetchBookingsByDate(updatedBooking.date))
        } else {
          dispatch(setNotification(result.error, 'error', 5))
        }
      }
    } else {
      dispatch(setNotification('You can change only your own event', 'error', 5))
    }
  }

  const slotPropGetter = useCallback(getSlotPropGetter(resources), [resources])

  const formats = {
    dayHeaderFormat: (date, culture, localizer) => localizer.format(date, 'MMMM Do dddd YYYY', culture),
    timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture)
  }

  if (!user) return null

  return (
    <>
      {showSpinner && <Spinner />}
      {!showSpinner && !loading && error && <p>Error: {error}</p>}
      {!showSpinner && !loading && !error &&
        <DnDCalendar
          localizer={localizer}
          defaultDate={moment(currentDate).toDate()}
          onNavigate={handleDateChange}
          events={events}
          resources={resources}
          resourceAccessor="resourceId"
          startAccessor="start"
          endAccessor="end"
          defaultView="day"
          views={['day']}
          step={30}
          min={moment().hours(7).minutes(0).toDate()}  // visibility of hours
          max={moment().hours(19).minutes(0).toDate()} // visibility of hours
          formats={formats}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          slotPropGetter={slotPropGetter}
          eventPropGetter={(event) => eventStyleGetter(event, user)}
          selectable
          resizable
        />
      }

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
    </>
  )
}

export default BookingCalendar