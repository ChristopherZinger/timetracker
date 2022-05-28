import { useEffect, useState } from 'react'
import type { TCategory } from '../../types/domains/Category'

// todo: Remove after firebase call is implemented
const categories: TCategory[] = [
  {
    abbreviation: 'FT',
    name: 'Free Time',
    id: Math.floor(Math.random() * 1000).toString(),
    isActive: true
  }
  ,
  {
    abbreviation: 'CR',
    name: 'Core Responsibility',
    id: Math.floor(Math.random() * 1000).toString(),
    isActive: true
  }
]

export default function useGetActiveCategories () {
  const [data, setCategories] = useState<undefined | TCategory[]>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<undefined | Error>(undefined)

  useEffect(() => {
    setIsLoading(true)
    // todo cal firebase api
    setCategories(categories)
    setIsLoading(false)
  }, [])

  return { isLoading, data, error }
}