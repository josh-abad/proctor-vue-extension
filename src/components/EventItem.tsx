import { ExamEvent } from '@/types'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface EventItemProps {
  event: ExamEvent;
  upcoming?: boolean;
}

const BASE_URL = 'https://www.proctorvue.live'

const EventItem = ({ event, upcoming = true }: EventItemProps): JSX.Element => {
  return (
    <li className="py-1">
      <a
        href={`${BASE_URL}${event.courseUrl}`}
        className="tracking-wider text-gray-300 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {event.course}
      </a>
      {' | '}
      <span>
        <a
          href={`${BASE_URL}${event.url}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold hover:underline"
        >
          {event.name}
        </a>
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
