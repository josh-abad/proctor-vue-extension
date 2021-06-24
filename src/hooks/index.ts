import { Exam } from '@/types'
import { useEffect, useState } from 'react'

export function useFetch(callback: (id: string) => Promise<Exam[]>) {
  const [data, setData] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function fetchData (id: string) {
    try {
      setLoading(true)
      const fetchedData = await callback(id)
      setData(fetchedData)
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  function clearData () {
    setData([])
  }

  return [
    data,
    fetchData,
    loading,
    error,
    clearData
  ] as const
}

export function useChromeStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState(defaultValue)

  useEffect(() => {
    chrome.storage.sync.get([key], items => {
      if (items[key]) {
        setData(items[key])
      }
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ [key]: data })
  }, [data])

  return [data, setData] as const
}
