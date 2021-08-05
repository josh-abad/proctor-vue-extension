import { Exam, User } from '@/types'
import axios from 'axios'

let token: string | null = null

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`
}

const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3001'
  : 'https://api.proctorvue.live'

async function fetchOpenExams () {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.get<Exam[]>(`${API_URL}/user/open-exams`, config)
  return response.data
}

async function fetchUpcomingExams () {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.get<Exam[]>(`${API_URL}/user/upcoming-exams`, config)
  return response.data
}

interface UserCredentials {
  email: string;
  password: string;
}

const login = async (credentials: UserCredentials): Promise<User> => {
  const { data } = await axios
    .post<Omit<User, 'tracking'>>(`${API_URL}/login`, credentials)
  return data
}

export default { setToken, fetchOpenExams, fetchUpcomingExams, login }
