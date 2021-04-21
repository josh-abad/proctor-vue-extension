import React, { useState, useEffect }  from 'react'
import ReactDOM from 'react-dom'
import SettingsButton from '@/components/SettingsButton'
import LogoutButton from '@/components/LogoutButton'
import AppSwitch from '@/components/AppSwitch'
import { ExamEvent, User } from '@/types'
import LoginView from '@/components/LoginView'
import EventItem from '@/components/EventItem'
import EventList from '@/components/EventList'
import ErrorMessage from '@/components/ErrorMessage'
import AppLogo from '@/components/AppLogo'
import API from '@/api'

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
        API.fetchExamEvents(items.user.id).then(response => {
          chrome.browserAction.setBadgeText({
            text: response.openExams.length.toString()
          })
          setOpenExams(response.openExams)
          setUpcomingExams(response.upcomingExams)
        })
      }
    })
  }, [])

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

  const handleLogIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const credentials = {
      email: emailInput,
      password: passwordInput
    }

    try { 
      const loggedInUser = await API.login(credentials)
      chrome.storage.sync.set({ user: loggedInUser }, async () => {
        setUser(loggedInUser)
        const response = await API.fetchExamEvents(loggedInUser.id)
        chrome.browserAction.setBadgeText({
          text: response.openExams.length.toString()
        })
        setOpenExams(response.openExams)
        setUpcomingExams(response.upcomingExams)
        setMessage('')
        setEmailInput('')
        setPasswordInput('')
      })
    } catch (error) {
      setMessage('Incorrect email or password.')
      setEmailInput('')
      setPasswordInput('')
    }
  }

  const handleLogOut: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    chrome.storage.sync.remove('user', () => {
      setUser(null)
      chrome.browserAction.setBadgeText({ text: '' })
    })
  }

  return (
    <div className="antialiased text-white bg-gray-800">
      <div className="flex items-center justify-between p-2 border-b border-gray-700 w-80">
        <SettingsButton />
        <AppLogo />
        <span className={user ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
          <LogoutButton onClick={handleLogOut} />
        </span>
      </div>
      {user ? (
        <div className="p-2 space-y-3">
          <EventList header="Exams for Today">
            {renderExamsEvents(openExams, false)}
          </EventList>
          <EventList header="Upcoming Exams">
            {renderExamsEvents(upcomingExams)}
          </EventList>
        </div>
      ) : (
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
      )}
      {user && (
        <div className="p-2 border-t border-gray-700">
          <AppSwitch
            checked={user.tracking}
            onChange={handleChange}
            label={`Tracking ${user.tracking ? 'Enabled' : 'Disabled'}`}
          />
        </div>
      )}
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('popup')
)
