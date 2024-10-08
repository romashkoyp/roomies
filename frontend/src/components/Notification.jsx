import { useSelector } from 'react-redux'
import NotificationWrapper from './styles/Notifications'

const Notification = () => {
  const { message, type } = useSelector((state) => state.notification)

  return message ? (
    <NotificationWrapper type={type}>
      {message}
    </NotificationWrapper>
  ) : null
}

export default Notification