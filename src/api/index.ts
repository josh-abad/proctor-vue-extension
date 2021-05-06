import { Exam, User } from '@/types'
import axios from 'axios'

const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3001'
  : 'https://api.proctorvue.live'

async function fetchOpenExams (id: string) {
  const response = await axios.get<Exam[]>(`${API_URL}/users/${id}/open-exams`)
  return response.data
}

async function fetchUpcomingExams (id: string) {
  const response = await axios.get<Exam[]>(`${API_URL}/users/v2/${id}/upcoming-exams`)
  return response.data
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

export default { fetchOpenExams, fetchUpcomingExams, login }
