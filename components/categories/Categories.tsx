import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import {
	Category,
	TCategory,
	TCategoryInput
} from '../../types/domains/Category'
import useGetActiveCategories from '../apiHooks/getActiveCategories'
import LoadingBox from '../common/LoadingBox'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'

type Props = {
	user: User
}

export default function Categories({ user }: Props) {
	const [categories, setCategories] = useState<TCategory[]>([])
	const { data: categoriesFromDb, isLoading } = useGetActiveCategories()
	const category = new Category(user.uid)

	useEffect(() => {
		if (categoriesFromDb?.length) {
			setCategories(categoriesFromDb)
		}
	}, [categoriesFromDb])

	const onUpdateCategory = async (
		data: { id: string } & Partial<TCategoryInput>
	) => {
		await category.update(data.id, data)
		setCategories((categories) =>
			categories.map((c) =>
				c.id === data.id
					? {
							...c,
							...data
					  }
					: c
			)
		)
	}
	return (
		<>
			<CategoryForm
				onSubmit={async (data) => {
					const category = new Category(user.uid)
					// todo make sure data has all fields
					const newCategoryDoc = await category.create(data)
					setCategories((categories) => [
						...categories,
						newCategoryDoc
					])
				}}
			/>

			{isLoading ? (
				<LoadingBox />
			) : (
				<CategoryList
					categories={categories}
					onUpdateCategory={onUpdateCategory}
				/>
			)}
		</>
	)
}
