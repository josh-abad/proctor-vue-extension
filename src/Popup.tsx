import React from 'react'
import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import SettingsButton from '@/components/SettingsButton'
import LogoutButton from '@/components/LogoutButton'
import AppSwitch from '@/components/AppSwitch'
import { Exam, User } from '@/types'
import LoginView from '@/components/LoginView'
import EventItem from '@/components/EventItem'
import EventList from '@/components/EventList'
import ErrorMessage from '@/components/ErrorMessage'
import AppLogo from '@/components/AppLogo'
import API from '@/api'
import { useFetch } from '@/hooks'
import LoadingWheel from './components/LoadingWheel'

const Popup = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [tracking, setTracking] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [message, setMessage] = useState('')
  const [
    openExams,
    fetchOpenExams,
    areOpenExamsLoading,
    openExamsError,
    clearOpenExams
  ] = useFetch(API.fetchOpenExams)
  const [
    upcomingExams,
    fetchUpcomingExams,
    areUpcomingExamsLoading,
    upcomingExamsError,
    clearUpcomingExams
  ] = useFetch(API.fetchUpcomingExams)

  useEffect(() => {
    chrome.storage.sync.get(['user'], items => {
      if (items.user) {
        setUser(items.user)
        fetchOpenExams(items.user.id)
        fetchUpcomingExams(items.user.id)
      }
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ user })
  }, [user])

  useEffect(() => {
    chrome.storage.sync.set({ tracking })
  }, [tracking])

  useEffect(() => {
    const n = openExams.length
    chrome.browserAction.setBadgeText({
      text: `${n || ''}`
    })
    chrome.browserAction.setTitle({
      title: n ? `${n} ${n === 1? 'exam' : 'exams'} today` : ''
    })
  }, [openExams])

  const renderExamsEvents = (exams: Exam[], isLoading: boolean, error: boolean) => {
    if (error) {
      return <div className="flex justify-center w-full text-gray-400">Couldn&apos;t load exams.</div>
    }

    if (isLoading) {
      return (
        <div className="flex justify-center w-full">
          <LoadingWheel />
        </div>  
      )
    }

    if (!exams.length) {
      return (
        <div className="flex justify-center w-full">
          <span className="py-1 text-gray-500">No exams available</span>
        </div>
      )
    }

    return exams.map(exam => (
      <EventItem exam={exam} key={exam.id} />
    ))
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTracking(e.target.checked)
  }

  const handleLogIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const credentials = {
      email: emailInput,
      password: passwordInput
    }

    try { 
      const loggedInUser = await API.login(credentials)
      setUser(loggedInUser)

      await Promise.all([
        fetchOpenExams(loggedInUser.id),
        fetchUpcomingExams(loggedInUser.id)
      ])

      setMessage('')
      setEmailInput('')
      setPasswordInput('')
    } catch (error) {
      setMessage('Incorrect email or password.')
      setEmailInput('')
      setPasswordInput('')
    }
  }

  const handleLogOut: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    setUser(null)
    clearOpenExams()
    clearUpcomingExams()
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
        <div className="px-4 py-2 space-y-3">
          <EventList header="Exams for Today">
            {renderExamsEvents(openExams, areOpenExamsLoading, openExamsError)}
          </EventList>
          {upcomingExams.length > 0 || areOpenExamsLoading ?(
            <EventList header="Upcoming Exams">
              {renderExamsEvents(upcomingExams, areUpcomingExamsLoading, upcomingExamsError)}
            </EventList>
          ) : (
            ''
          )}
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
            checked={tracking}
            onChange={handleChange}
            label={`Tracking ${tracking ? 'Enabled' : 'Disabled'}`}
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
