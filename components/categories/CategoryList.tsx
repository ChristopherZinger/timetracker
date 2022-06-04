import { useState } from 'react'
import {
	Category,
	TCategory,
	TCategoryInput
} from '../../types/domains/Category'
import CategoryForm from './CategoryForm'

type Props = {
	userId: string
	categories: TCategory[]
	reload: () => Promise<void>
}

export default function CategoryList({ reload, categories, userId }: Props) {
	const [selectedCategory, setSelectedCategory] = useState<
		undefined | string
	>(undefined)

	const category = new Category(userId)

	async function onUpdateCategory(
		data: { id: string } & Partial<TCategoryInput>
	) {
		await category.update(data.id, data)
		await reload()
	}

	async function onDeactivateCategory(id: string) {
		await category.deactivate(id)
		await reload()
	}

	return (
		<div className='flex flex-col gap-y-6'>
			{categories.map((c) => (
				<div key={c.id}>
					{selectedCategory === c.id ? (
						<div className='px-4 py-6 flex gap-x-8 border'>
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
								onClick={() => onDeactivateCategory(c.id)}
							>
								remove
							</button>
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
		</div>
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
