import React, { useState, useEffect }  from 'react'
import ReactDOM from 'react-dom'
import PopoutButton from '@/components/PopoutButton'
import LogoutButton from '@/components/LogoutButton'
import AppSwitch from '@/components/AppSwitch'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const API_URL = 'https://api.proctorvue.live'
const TEST_ID = '5fe045722adcd91368529293' // Admin ID for testing

const Popup = (): JSX.Element => {
  const [tracking, setTracking] = useState(false)
  const [openExams, setOpenExams] = useState<ExamEvent[]>([])
  const [upcomingExams, setUpcomingExams] = useState<ExamEvent[]>([])

  useEffect(() => {
    chrome.storage.sync.get(['tracking'], items => {
      setTracking(items.tracking)
    })
  })

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get<EventResponse[]>(`${API_URL}/users/${TEST_ID}/upcoming-exams`)

      const mapEvent = (event: EventResponse): ExamEvent => {
        return {
          course: event.location,
          name: event.subject,
          eventType: event.action === 'opens' ? 'UPCOMING' : 'ACTIVE',
          date: event.date
        }
      }

      setOpenExams(data.filter(event => event.action === 'closes').map(mapEvent))
      setUpcomingExams(data.filter(event => event.action === 'opens').map(mapEvent))
    }
    getData()
  })

  const renderExamsEvents = (events: ExamEvent[], upcoming = true) => {
    if (!events.length) {
      return (
        <div className="flex justify-center w-full">
          <span className="py-1 text-gray-500">No exams available</span>
        </div>
      )
    }

    return events.map((e, i) => {
      return (
        <li key={i} className="py-1">
          <span className="tracking-wider text-gray-300">
            {e.course}
          </span>
          {' | '}
          <span>
            <span className="text-sm font-semibold cursor-pointer hover:underline">
              {e.name}
            </span>
            <span className="text-gray-300">
              {upcoming
                ? ` opens ${dayjs().from(dayjs(e.date))}`
                : ` open for ${dayjs().to(dayjs(e.date), true)}`
              }
            </span>
          </span>
        </li>
      )
    })
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setTracking(target.checked)
    chrome.storage.sync.set({ tracking: target.checked })
  }

  return (
    <div className="antialiased text-white bg-gray-800">
      <div className="flex items-center justify-between p-2 border-b border-gray-700 w-80">
        <PopoutButton />
        <img src="logo.png" alt="Logo" className="w-32" />
        <LogoutButton />
      </div>
      <div className="p-2">
        <div className="flex justify-center w-full">
          <h2 className="font-semibold tracking-wide text-gray-200 text-md">
          Exams for Today
          </h2>
        </div>
        <ul className="flex justify-center w-full">
          {renderExamsEvents(openExams, false)}
        </ul>
        <div className="flex justify-center w-full mt-3">
          <h2 className="font-semibold tracking-wide text-gray-200 text-md">
          Upcoming Exams
          </h2>
        </div>
        <ul className="flex justify-center w-full">
          {renderExamsEvents(upcomingExams)}
        </ul>
      </div>
      <div className="p-2 border-t border-gray-700">
        <AppSwitch
          checked={tracking}
          handleChange={handleChange}
          label={`Tracking ${tracking ? 'Enabled' : 'Disabled'}`}
        />
      </div>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('popup')
)
