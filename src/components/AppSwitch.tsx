import React from 'react'

interface AppSwitchProps {
  checked: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
}

const AppSwitch = ({ checked, handleChange, label }: AppSwitchProps): JSX.Element => {
  return (
    <>
      <label className="inline-flex items-center space-x-3 cursor-pointer">
        <span className="relative">
          <span
            className={`block w-10 h-6 rounded-full shadow-inner ${ checked ? 'bg-green-500' : 'bg-gray-600' }`}
          />
          <span className={`absolute inset-y-0 left-0 block w-4 h-4 mt-1 ml-1 transition-transform duration-300 ease-in-out bg-white rounded-full shadow-lg ${checked ? 'transform translate-x-full' : ''}`}>
            <input type="checkbox" onChange={handleChange} checked={checked} className="absolute w-0 h-0 opacity-0" />
          </span>
        </span>
        {label &&
          <span className="font-semibold tracking-wide text-md">
            {label}
          </span>
        }
      </label>
    </>
  )
}

export default AppSwitch
