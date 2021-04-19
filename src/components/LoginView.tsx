import React from 'react'
import AppButton from './AppButton'
import AppTextInput from './AppTextInput'
import InputLabel from './InputLabel'

interface LoginViewProps {
  email: string;
  password: string;
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
  onEmailChange: React.ChangeEventHandler<HTMLInputElement>;
  onPasswordChange: React.ChangeEventHandler<HTMLInputElement>;
}

const LoginView = (props: LoginViewProps): JSX.Element => {
  const { email, password, onSubmit, onEmailChange, onPasswordChange } = props

  return (
    <div className="flex justify-center w-full">
      <div className="py-5">
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
          <AppButton onClick={onSubmit}>
            Sign In
          </AppButton>
        </div>
      </div>
    </div>
  )
}

export default LoginView
