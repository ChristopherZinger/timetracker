import { useState } from 'react'
import { TCategory, TCategoryInput } from '../../types/domains/Category'
import CategoryForm from './CategoryForm'

type Props = {
	categories: TCategory[]
	onUpdateCategory: (
		data: { id: string } & Partial<TCategoryInput>
	) => Promise<void>
}

export default function CategoryList(props: Props) {
	const { categories, onUpdateCategory } = props
	const [selectedCategory, setSelectedCategory] = useState<
		undefined | string
	>(undefined)

	return (
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
								onSubmit={async (data) => {
									await onUpdateCategory({
										id: c.id,
										...data
									})
									setSelectedCategory(undefined)
								}}
								initialValues={c}
							/>
						</>
					)}
				</div>
			))}
		</>
	)
}
