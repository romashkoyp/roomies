import { useSelector } from 'react-redux'

import NotificationWrapper from './styles/Notifications'

const Notification = () => {
  const { message, type } = useSelector((state) => state.notification)
  const iconClass = type === 'error' ? 'fa-solid fa-exclamation fa-lg' : 'fa-solid fa-check fa-lg'

  return message ? (
    <NotificationWrapper type={type}>
      <i className={iconClass} style={{ paddingRight: '1em' }} />
      {message}
    </NotificationWrapper>
  ) : null
}

export default Notification