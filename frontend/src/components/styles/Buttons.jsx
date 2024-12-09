import styled, { css } from 'styled-components'

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  font-weight: 600;
  padding: 0.75em 1.5em;
  border: 2px solid transparent;
  border-radius: 0.25em;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease; border-color 0.3s ease;
  margin: 1em 1.5em 0.3em 0;
  height: 35px;
  width: 120px;
  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media(max-width: 830px){
    font-size: small;
    width: 40%;
  }
`
const PrimaryButton = styled.button`
  ${buttonStyles}
  background-color: #007bff;
  color: #fff;

  &:hover {
    background-color: #0056b3;
  }
`
const SecondaryButton = styled.button`
  ${buttonStyles}
  background-color: transparent;
  color: #ff5c5c;
  border-color: #ff5c5c;

  &:hover {
    background-color: #ff5c5c;
    color: #fff;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 0.1em;
  right: 0.2em;
  background: none;
  border: none;
  font-size: 2.5em;
  cursor: pointer;
  color: #888;

  &:hover {
    color: #333;
  }
  
  @media(max-width: 830px){
    font-size: 2.2em;
  }
`

export { CloseButton, PrimaryButton, SecondaryButton }