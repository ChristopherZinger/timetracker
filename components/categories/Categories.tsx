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
		<div className='w-9/12 mx-auto mb-20 mt-10 px-10 gap-y-8'>
			<h1 className='text-xl mb-8'>Add Category:</h1>
			<div className='mb-8'>
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
			</div>
			<hr />

			{isLoading ? (
				<LoadingBox />
			) : (
				<div className='py-8'>
					<CategoryList
						categories={categories}
						onUpdateCategory={onUpdateCategory}
					/>
				</div>
			)}
		</div>
	)
}
