import styled from 'styled-components'

const Container = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
`

const MessageWrapper = styled.div`
  //margin: 0.5%;
  margin-left: 0;
  padding: 10px 0px 10px 0px;
  //border-radius: 3px;
  //border-bottom: 0.5px solid grey;
  //background-color: white;
`

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

const Wrapper = styled.div`
  margin-top: 20px;
  padding: 20px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`


export default { Container, MessageWrapper, NotificationWrapper, Wrapper }