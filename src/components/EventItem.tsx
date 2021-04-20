import { ExamEvent } from '@/types'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface EventItemProps {
  event: ExamEvent;
  upcoming?: boolean;
}

const EventItem = ({ event, upcoming = true }: EventItemProps): JSX.Element => {
  return (
    <li className="py-1">
      <span className="tracking-wider text-gray-300">
        {event.course}
      </span>
      {' | '}
      <span>
        <span className="text-sm font-semibold cursor-pointer hover:underline">
          {event.name}
        </span>
        <span className="text-gray-300">
          {upcoming
            ? ` opens ${dayjs().from(dayjs(event.date))}`
            : ` open for ${dayjs().to(dayjs(event.date), true)}`
          }
        </span>
      </span>
    </li>
  )
}

export default EventItem
