import Input from './styles/Input'
import { PrimaryButton } from './styles/Buttons'

const SigninForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        Username
        <Input
          type="email"
          placeholder="email"
          id="username"
          value={username}
          onChange={({ target }) => handleUsernameChange(target.value)}
          autoComplete="current-username"
        />
      </div>
      <div>
        Password
        <Input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={({ target }) => handlePasswordChange(target.value)}
          autoComplete="current-password"
        />
      </div>
      <PrimaryButton type="submit">Sign In</PrimaryButton>
    </form>
  )
}

export default SigninForm