import React from 'react'

interface InputLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

const InputLabel = ({ children, htmlFor }: InputLabelProps): JSX.Element => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-400">
    {children}
  </label>
)

export default InputLabel
