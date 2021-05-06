import { Exam } from '@/types'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface EventItemProps {
  exam: Exam;
  upcoming?: boolean;
}

const BASE_URL = 'https://www.proctorvue.live'

const EventItem = ({ exam, upcoming = true }: EventItemProps): JSX.Element => {
  return (
    <li className="py-1">
      <a
        href={`${BASE_URL}/courses/${exam.course.id}`}
        className="tracking-wider text-gray-300 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {exam.course.name}
      </a>
      {' | '}
      <span>
        <a
          href={`${BASE_URL}/courses/${exam.course.id}/exams/${exam.id}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold hover:underline"
        >
          {exam.label}
        </a>
        <span className="text-gray-300">
          {upcoming
            ? ` opens ${dayjs().to(dayjs(exam.startDate))}`
            : ` open for ${dayjs().to(dayjs(exam.endDate), true)}`
          }
        </span>
      </span>
    </li>
  )
}

export default EventItem
