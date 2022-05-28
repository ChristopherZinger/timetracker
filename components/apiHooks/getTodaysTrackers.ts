import { useEffect, useState } from 'react'
import { TTracker } from '../../types/domains/Timetracker'

const getTrackers = (): Promise<TTracker[]> => new Promise((res) => res([
  {
    category: '2',
    end: new Date('Sat May 28 2022 15:00:00 GMT+0200').getTime(),
    start: new Date('Sat May 28 2022 15:30:00 GMT+0200').getTime(),
    id: 'asdfasdf',
    info: 'Coding tracker info'
  },
  {
    category: '1',
    end: new Date('Sat May 28 2022 15:30:00 GMT+0200').getTime(),
    start: new Date('Sat May 28 2022 16:00:00 GMT+0200').getTime(),
    id: 'asdfasdf',
    info: 'Another tracker'
  }
]))

export default function useGetTodaysTrackers () {
  const [data, setData] = useState<undefined | TTracker[]>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<undefined | Error>(undefined)

  useEffect(() => {
    setIsLoading(true)
    getTrackers().then(d => {
      setData(d)
      setIsLoading(false)
    }).catch(err => {
      setError(err)
      setIsLoading(false)
    })
  }, [])

  return { error, data, isLoading }
}
