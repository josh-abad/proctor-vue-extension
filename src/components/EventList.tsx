import React from 'react'

interface EventListProps {
  header: string;
  children: React.ReactNode;
}

const EventList = ({ header, children }: EventListProps): JSX.Element => {
  return (
    <>
      <header className="flex justify-center w-full">
        <h2 className="font-semibold tracking-wide text-gray-200 text-md">
          {header}
        </h2>
      </header>
      <ul className="flex flex-col items-center w-full">
        {children}
      </ul>
    </>
  )
}

export default EventList
