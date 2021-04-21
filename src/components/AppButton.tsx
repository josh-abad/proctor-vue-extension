import React from 'react'

interface AppButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const AppButton = ({ onClick, children }: AppButtonProps): JSX.Element => {
  return (
    <button
      className="w-full px-6 py-2 text-sm font-semibold text-white capitalize duration-300 ease-in-out rounded-lg shadow appearance-none focus:outline-none bg-gradient-to-t from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export default AppButton
