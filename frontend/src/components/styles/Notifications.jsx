import styled from 'styled-components'

const NotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.type === 'error' ? '#ff5c5c' : '#4caf50')};
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  font-weight: 500;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`

export default NotificationWrapper