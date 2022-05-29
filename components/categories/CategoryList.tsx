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
				<div
					key={c.id}
					className={selectedCategory === c.id ? 'py-6' : ''}
				>
					{selectedCategory === c.id ? (
						<div className='p-2 flex gap-x-8'>
							<div className='flex-1'>
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
							</div>
							<button
								className='font-bold'
								onClick={() => setSelectedCategory(undefined)}
							>
								cancel
							</button>
						</div>
					) : (
						<div onClick={() => setSelectedCategory(c.id)}>
							<CategoryListItem item={c} />
						</div>
					)}
				</div>
			))}
		</>
	)
}

function CategoryListItem({ item }: { item: TCategory }) {
	return (
		<div className='flex py-1 cursor-pointer'>
			<div className='basis-12'>{item.abbreviation}</div>
			<div className='flex-1'>{item.name}</div>
		</div>
	)
}
