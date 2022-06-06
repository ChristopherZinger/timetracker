import { useContext, useEffect, useState } from 'react'
import type { TDaySummary } from '../../types/domains/DaySummary'
import { DaySummary } from '../../types/domains/DaySummary'
import { AppError } from '../../utils/appError'
import { UserContext } from '../UserContext'

export default function useGetDaySummary (date: Date) {
  const [data, setData] = useState<undefined | TDaySummary>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<undefined | Error>(undefined)
  const { user } = useContext(UserContext)

  async function getData (date: Date) {
    if (!user) {
      throw new AppError('user_required_to_query_day-summary')
    }
    const daySummary = new DaySummary(user.uid)
    return await daySummary.getDaySummaryForDate(date)
  }

  function handleCall (date: Date) {
    setIsLoading(true)
    getData(date)
      .then((daySummary) => {
        setData(daySummary)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setError(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleCall(date)
  }, [date])

  return {
    isLoading,
    data,
    error,
    reload: async (d: Date = date) => await handleCall(d)
  }
}
