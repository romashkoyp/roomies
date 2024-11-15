import styled, { css } from 'styled-components'

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease; border-color 0.3s ease;
  margin: 1rem 1.5rem 0.3rem 0;
  height: 35px; // Set the height of the button
  width: 120px; // Set the width of the button
  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  top: 0.2rem;
  right: 0.8rem;
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #333;
  }
`

export { CloseButton,PrimaryButton, SecondaryButton }