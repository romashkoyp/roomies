import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { selectUser } from '../../../reducers/userReducer'
import { selectIndividualDatesForRoom } from '../../../reducers/individualDateReducer'
import Wrapper from '../../styles/Wrappers'
import { SecondaryButton } from '../../styles/Buttons'
import individualDateService from '../../../services/individualDate'
import { setNotification } from '../../../reducers/notificationReducer'
import { fetchIndividualDatesForRoom } from '../../../reducers/individualDateReducer'

const SingleDate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { id, date } = useParams()
  const currentRoomId = Number(id)
  const individualDatesForRoom = useSelector(selectIndividualDatesForRoom)
  const currentIndividualDate = individualDatesForRoom.find(item => item.date === date)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const formatTime = (time) => (time ? time.slice(0, -3) : null)

  if (!user || !currentIndividualDate) return null

  const handleDeleteDate = async (event) => {
    event.preventDefault()
    if (confirm("Are you sure?")) {
      const result = await individualDateService.deleteRoomDate(currentRoomId, date)
      if (result.success) {
        dispatch(fetchIndividualDatesForRoom(currentRoomId))
        dispatch(setNotification('Date deleted', 'success', 5))
        navigate(`/rooms/${currentRoomId}/dates`)
      } else {
        dispatch(setNotification(result.error, 'error', 5))
      }
    }
  }

  return (
    <Wrapper>
      <h3>Individual date for {currentIndividualDate.room?.name} room</h3>
      <table>
        <tbody>
          <tr>
            <th>Date</th>
            <td>{currentIndividualDate.date}</td>
          </tr>
          <tr>
            <th>Day Of Week</th>
            <td>{daysOfWeek[currentIndividualDate.dayOfWeek]}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{currentIndividualDate.name}</td>
          </tr>
          <tr>
            <th>Availability</th>
            <td>{currentIndividualDate.availability ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Time Start</th>
            <td>{formatTime(currentIndividualDate.timeBegin)}</td>
          </tr>
          <tr>
            <th>Time End</th>
            <td>{formatTime(currentIndividualDate.timeEnd)}</td>
          </tr>
        </tbody>
      </table>
      {user.admin && user.enabled ? (
        <SecondaryButton onClick={handleDeleteDate}>Delete</SecondaryButton>
      ) : null}
    </Wrapper>
  )
}

export default SingleDate