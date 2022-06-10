import { useContext, useEffect, useState } from 'react'
import { Timetracker, TTracker } from '../../types/domains/Timetracker'
import { AppError } from '../../utils/appError'
import { UserContext } from '../UserContext'

export default function useGetTrackersForDay (date: Date) {
  const [data, setData] = useState<undefined | TTracker[]>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<undefined | Error>(undefined)
  const { user } = useContext(UserContext)

  async function getTrackers (date: Date): Promise<TTracker[]> {
    if (!user) {
      throw new AppError('user_required_to_query_trackers')
    }
    const timetracker = new Timetracker(user.uid)
    return await timetracker.getTrackersForDay(date)
  }

  async function handleCall (date: Date) {
    setIsLoading(true)
    getTrackers(date)
      .then((d) => {
        setData(d)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleCall(date)
  }, [date])

  return { error, data, isLoading, reload: async (date: Date) => await handleCall(date) }
}

