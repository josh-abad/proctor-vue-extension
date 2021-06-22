import React from 'react'

interface EventListProps {
  header: string;
  children: React.ReactNode;
}

const EventList = ({ header, children }: EventListProps): JSX.Element => {
  return (
    <section>
      <header className="text-xs font-semibold tracking-wide text-gray-200">
        {header}
      </header>
      <ul className="mt-2 space-y-2">
        {children}
      </ul>
    </section>
  )
}

export default EventList
