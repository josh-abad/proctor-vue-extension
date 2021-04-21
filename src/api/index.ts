import { EventResponse, ExamEvent, User } from '@/types'
import axios from 'axios'

const API_URL = 'https://api.proctorvue.live'

interface APIResponse {
  openExams: ExamEvent[];
  upcomingExams: ExamEvent[];
}

const fetchExamEvents = async (id: string): Promise<APIResponse> => {
  try {
    const { data } = await axios
      .get<EventResponse[]>(`${API_URL}/users/${id}/upcoming-exams`)

    const mapEvent = (event: EventResponse): ExamEvent => {
      return {
        course: event.location,
        name: event.subject,
        eventType: event.action === 'opens' ? 'UPCOMING' : 'ACTIVE',
        date: event.date,
        url: event.subjectUrl,
        courseUrl: event.locationUrl
      }
    }

    const openExams = data
      .filter(event => event.action === 'closes')
      .map(mapEvent)
 
    const upcomingExams = data
      .filter(event => event.action === 'opens')
      .map(mapEvent)

    return {
      openExams,
      upcomingExams
    }
  } catch (error) {
    return {
      openExams: [],
      upcomingExams: [],
    }
  }
}

interface UserCredentials {
  email: string;
  password: string;
}

const login = async (credentials: UserCredentials): Promise<User> => {
  const { data } = await axios
    .post<Omit<User, 'tracking'>>(`${API_URL}/login`, credentials)
  return { ...data, tracking: false }
}

export default { fetchExamEvents, login }
