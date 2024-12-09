import styled from 'styled-components'

const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline; 
  position: fixed;
  width: auto;
  top: 44px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.type === 'error' ? '#ff5c5c' : '#4caf50')};
  color: #fff;
  padding: 16px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 1em;
  font-weight: 500;
  animation: fadeIn 0.3s ease-in-out;
  z-index: 999;

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