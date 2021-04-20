import React, { useState, useEffect }  from 'react'
import ReactDOM from 'react-dom'
import PopoutButton from '@/components/PopoutButton'
import LogoutButton from '@/components/LogoutButton'
import AppSwitch from '@/components/AppSwitch'
import { EventResponse, ExamEvent, User } from '@/types'
import axios from 'axios'
import LoginView from '@/components/LoginView'
import EventItem from '@/components/EventItem'
import EventList from '@/components/EventList'
import ErrorMessage from '@/components/ErrorMessage'

const API_URL = 'https://api.proctorvue.live'

const Popup = (): JSX.Element => {
  const [openExams, setOpenExams] = useState<ExamEvent[]>([])
  const [upcomingExams, setUpcomingExams] = useState<ExamEvent[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    chrome.storage.sync.get(['user'], items => {
      if (items.user) {
        setUser(items.user)
        fetchExamEvents(items.user.id)
      }
    })
  })

  const fetchExamEvents = async (id: string) => {
    try {
      const { data } = await axios
        .get<EventResponse[]>(`${API_URL}/users/${id}/upcoming-exams`)

      const mapEvent = (event: EventResponse): ExamEvent => {
        return {
          course: event.location,
          name: event.subject,
          eventType: event.action === 'opens' ? 'UPCOMING' : 'ACTIVE',
          date: event.date
        }
      }

      const fetchedOpenExams = data
        .filter(event => event.action === 'closes')
        .map(mapEvent)

      setOpenExams(fetchedOpenExams)

      const fetchedUpcomingExams = data
        .filter(event => event.action === 'opens')
        .map(mapEvent)

      setUpcomingExams(fetchedUpcomingExams)
    } catch (error) {
      setUpcomingExams([])
    }
  }

  const renderExamsEvents = (events: ExamEvent[], upcoming = true) => {
    if (!events.length) {
      return (
        <div className="flex justify-center w-full">
          <span className="py-1 text-gray-500">No exams available</span>
        </div>
      )
    }

    return events.map((e, i) => (
      <EventItem event={e} key={i} upcoming={upcoming} />
    ))
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (user) {
      const updatedUser = { ...user, tracking: e.target.checked }
      chrome.storage.sync.set({ user: updatedUser }, () => {
        setUser(updatedUser)
      })
    }
  }

  const handleLogIn: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    const credentials = {
      email: emailInput,
      password: passwordInput
    }

    try { 
      const { data } = await axios.post<Omit<User, 'tracking'>>(`${API_URL}/login`, credentials)
      const loggedInUser = { ...data, tracking: false }
      chrome.storage.sync.set({ user: loggedInUser }, () => {
        setUser(loggedInUser)
        fetchExamEvents(loggedInUser.id)
        setMessage('')
      })
    } catch (error) {
      setMessage('Incorrect email or password.')
    }
  }

  const handleLogOut: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    chrome.storage.sync.remove('user', () => {
      setUser(null)
    })
  }

  return (
    <div className="antialiased text-white bg-gray-800">
      <div className="flex items-center justify-between p-2 border-b border-gray-700 w-80">
        <PopoutButton />
        <img src="logo.png" alt="Logo" className="w-32" />
        <span className={user ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
          <LogoutButton onClick={handleLogOut} />
        </span>
      </div>
      {user ?
        <div className="p-2">
          <EventList header="Exams for Today">
            {renderExamsEvents(openExams, false)}
          </EventList>
          <EventList header="Upcoming Exams">
            {renderExamsEvents(upcomingExams)}
          </EventList>
        </div>
        :
        <>
          <LoginView
            email={emailInput}
            password={passwordInput}
            onSubmit={handleLogIn}
            onEmailChange={e => setEmailInput(e.target.value)}
            onPasswordChange={e => setPasswordInput(e.target.value)}
          />
          {message && <ErrorMessage message={message} />}
        </>
      }
      {user &&
        <div className="p-2 border-t border-gray-700">
          <AppSwitch
            checked={user.tracking}
            onChange={handleChange}
            label={`Tracking ${user.tracking ? 'Enabled' : 'Disabled'}`}
          />
        </div>
      }
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('popup')
)
