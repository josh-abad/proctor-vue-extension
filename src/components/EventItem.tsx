import { Exam } from '@/types'
import React from 'react'

interface EventItemProps {
  exam: Exam;
}

const BASE_URL = 'https://www.proctorvue.live'

const EventItem = ({ exam }: EventItemProps): JSX.Element => {
  return (
    <li className="text-sm">
      <span>
        <a
          href={`${BASE_URL}/courses/${exam.course.id}/exams/${exam.id}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-indigo-300 hover:underline"
        >
          {exam.label}
        </a>
      </span>
      {' in '}
      <span>
        <a
          href={`${BASE_URL}/courses/${exam.course.id}`}
          className="font-semibold text-indigo-300 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {exam.course.name}
        </a>
      </span>
    </li>
  )
}

export default EventItem
