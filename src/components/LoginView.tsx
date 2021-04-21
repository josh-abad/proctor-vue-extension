import React from 'react'
import AppButton from './AppButton'
import AppTextInput from './AppTextInput'
import InputLabel from './InputLabel'

interface LoginViewProps {
  email: string;
  password: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onEmailChange: React.ChangeEventHandler<HTMLInputElement>;
  onPasswordChange: React.ChangeEventHandler<HTMLInputElement>;
}

const LoginView = (props: LoginViewProps): JSX.Element => {
  const { email, password, onSubmit, onEmailChange, onPasswordChange } = props

  return (
    <div className="flex justify-center w-full">
      <form className="py-5" onSubmit={onSubmit}>
        <div>
          <InputLabel htmlFor="email">Email</InputLabel>
          <AppTextInput id="email" value={email} onChange={onEmailChange} />
        </div>
        <div className="mt-3">
          <InputLabel htmlFor="password">Password</InputLabel>
          <AppTextInput
            id="password"
            type="password"
            value={password}
            onChange={onPasswordChange}
          />
        </div>
        <div className="mt-3">
          <AppButton type="submit">
            Sign In
          </AppButton>
        </div>
      </form>
    </div>
  )
}

export default LoginView
