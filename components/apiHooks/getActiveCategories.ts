import { useContext, useEffect, useState } from 'react'
import { Category, TCategory } from '../../types/domains/Category'
import { AppError } from '../../utils/appError'
import { UserContext } from '../UserContext'

export default function useGetActiveCategories () {
  const [data, setCategories] = useState<undefined | TCategory[]>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<undefined | Error>(undefined)
  const { user } = useContext(UserContext)

  async function getCategories () {
    if (!user) {
      throw new AppError('user_required_to_query_categories')
    }
    const category = new Category(user?.uid)
    return await category.getAllActive()
  }

  function handleCall () {
    setIsLoading(true)
    getCategories()
      .then((categories) => {
        setCategories(categories)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleCall()
  }, [])

  return { isLoading, data, error, reload: async () => await handleCall() }
}
