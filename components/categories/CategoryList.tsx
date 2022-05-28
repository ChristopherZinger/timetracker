import { useState } from 'react'
import { Category, TCategory } from '../../types/domains/Category'
import LoadingBox from '../common/LoadingBox'
import CategoryForm from './CategoryForm'

type Props = {
	userId: string
}

export default function CategoryList(props: Props) {
	const { userId } = props
	const category = new Category(userId)
	const [categories, setCategories] = useState<undefined | TCategory[]>(
		undefined
	)
	const [selectedCategory, setSelectedCategory] = useState<
		undefined | string
	>(undefined)

	category.getAllActive().then((r) => {
		setCategories(r)
	})

	return categories ? (
		<>
			{categories.map((c) => (
				<div key={c.id}>
					<div onClick={() => setSelectedCategory(c.id)}>
						{c.abbreviation}
					</div>
					{selectedCategory === c.id && (
						<>
							<button
								onClick={() => setSelectedCategory(undefined)}
							>
								exit edit mode
							</button>
							<CategoryForm
								userId={userId}
								onSubmit={async (_, data) => {
									await category.update(c.id, data)
								}}
								initialValues={c}
							/>
						</>
					)}
				</div>
			))}
		</>
	) : (
		<LoadingBox />
	)
}
