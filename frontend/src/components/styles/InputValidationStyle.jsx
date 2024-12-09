import styled from 'styled-components'

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasError',
})`
  flex-grow: 1;
  max-width: 300px;
  width: 90%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid ${(props) => (props.hasError ? '#ff5c5c' : '#ccc')};
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: ${(props) => (props.hasError ? '#ff5c5c' : '#007bff')};
    box-shadow: ${(props) =>
      props.hasError
        ? '0 0 5px rgba(220, 53, 69, 0.5)'
        : '0 0 5px rgba(0, 123, 255, 0.5)'};
  }
`

export default StyledInput