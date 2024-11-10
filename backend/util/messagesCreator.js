const { Notification } = require('../models')

const createMessages = async () => {
  let messages
  messages = await Notification.findAll()

  if (messages.length > 0) {
    console.log(`There are ${messages.length} messages in database`)
    return
  }

  if (messages.length === 0) {

    await Notification.create({
      id: '1',
      userId: '1',
      content: 'Dear Customer, if you want to book a room, you can do so on the Booking page. Just choose a room and an available time slot. You can change or delete your booking. It is easy to identify your bookings as they are green, while others\' bookings are grey and cannot be changed or deleted by you. The red area indicates the border of available hours, which may vary for each room.'
    })

    await Notification.create({
      id: '2',
      userId: '1',
      content: 'This message can be read only by registered users. This is how the admin can communicate with users inside the app.'
    })
  }

  messages = await Notification.findAll()

  if (messages.length === 2) {
    console.log('2 message created!')
    return
  }

  if (messages.length === 0) {
    console.log('Something went wrong with messages creation')
    return
  }
}

module.exports = { createMessages }