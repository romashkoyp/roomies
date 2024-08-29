import { useState } from 'react'
import styled from 'styled-components'

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
`

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const SigninForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleSubmit }) => {
  return (
    <FormContainer>
    <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <Input
          type="email"
          id="username"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />

        <Button type="submit">Sign In</Button>
    </form>
    </FormContainer>
  )
}

export default SigninForm