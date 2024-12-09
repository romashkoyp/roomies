const { Room } = require('../models')

const createRooms = async () => {
  let existingRooms
  existingRooms = await Room.findAll()

  if (existingRooms.length > 0) {
    console.log(`There are ${existingRooms.length} rooms in database`)
    return
  }

  if (existingRooms.length === 0) {

    await Room.create({
      id: '100',
      userId: '1',
      name: 'Meeting room',
      capacity: 10,
      size: 30,
      imagePath: 'https://media.istockphoto.com/id/1323139676/fi/valokuva/tyhj%C3%A4n-kokoushuoneen-ulkon%C3%A4kym%C3%A4-p%C3%B6yt%C3%A4-ja-toimistotuoleilla.jpg?s=2048x2048&w=is&k=20&c=a5KSG8aAxjem7T8EWyLbpCadh-bgKcxqwYB1uOlRzJY=',
    })

    await Room.create({
      id: '200',
      userId: '1',
      name: 'Conference room',
      capacity: 25,
      size: 50,
      imagePath: 'https://media.istockphoto.com/id/894762852/fi/valokuva/%C3%A4lyk%C3%A4s-n%C3%A4ytt%C3%B6-%C3%A4lykk%C3%A4%C3%A4ll%C3%A4-kodilla-modernilla-kokoustilalla.jpg?s=2048x2048&w=is&k=20&c=jQJhJYvSoRuwPFzdJIClaMxqw-lnCLTRXZzw6VPqagY=',
    })

    await Room.create({
      id: '300',
      userId: '1',
      name: 'Concert hall',
      capacity: 75,
      size: 200,
      imagePath: 'https://media.istockphoto.com/id/2133834087/fi/valokuva/movie-theather.jpg?s=2048x2048&w=is&k=20&c=cS8lBpVyvF3t5n1aL9RJqdtZf2ORQX4WZU9fLmMTAO4=',
    })
  }

  existingRooms = await Room.findAll()

  if (existingRooms.length === 3) {
    console.log('3 room created!')
    return
  }

  if (existingRooms.length === 0) {
    console.log('Something went wrong with rooms creation')
    return
  }
}

module.exports = { createRooms }