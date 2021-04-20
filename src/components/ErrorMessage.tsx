import React from 'react'

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps): JSX.Element => {
  return (
    <div className="flex justify-center w-full pb-5">
      <div className="px-2 py-1 bg-red-800 border border-red-300 rounded-md bg-opacity-10 border-opacity-10">
        <span className="text-red-300">
          {message}
        </span>
      </div>
    </div>
  )
}

export default ErrorMessage
