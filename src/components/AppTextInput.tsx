import React from 'react'

interface AppTextInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: 'text' | 'password';
  id?: string
}

const AppTextInput = ({ type = 'text', value, onChange, id }: AppTextInputProps): JSX.Element => {
  return (
    <input
      id={id}
      type={type}
      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow focus:outline-none focus:ring-0 focus:border-green-500"
      value={value}
      onChange={onChange}
    />
  )
}

export default AppTextInput
