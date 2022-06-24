import { useState } from 'react'
import {
	Category,
	TCategory,
	TCategoryInput
} from '../../types/domains/Category'
import CategoryDot from './CategoryDot'
import { InputErrorsMap } from '../../types/utils/validator'
import CategoryForm from './CategoryForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
	userId: string
	categories: TCategory[]
	reload: () => Promise<void>
}

export default function CategoryList({ reload, categories, userId }: Props) {
	const [selectedCategory, setSelectedCategory] = useState<
		undefined | string
	>(undefined)
	const [inputErrors, setInputErrors] = useState<InputErrorsMap>({})

	const category = new Category(userId)

	async function onUpdateCategory(
		data: { id: string } & Partial<TCategoryInput>
	) {
		const errors = await category.update(data.id, data)
		if (errors) {
			setInputErrors(errors)
		} else {
			setInputErrors({})
			setSelectedCategory(undefined)
			await reload()
		}
	}

	async function onDeactivateCategory(id: string) {
		await category.deactivate(id)
		await reload()
	}

	async function swapOrder(cA: TCategory, cB: TCategory) {
		await category.swapOrder(cA, cB)
		reload()
	}

	return (
		<div className='flex flex-col gap-y-6'>
			{categories.map((c, i) => (
				<div key={c.id} className='flex gap-x-6'>
					<ChangeOrderArrows
						onMoveDown={() => swapOrder(c, categories[i + 1])}
						onMoveUp={() => swapOrder(c, categories[i - 1])}
						up={i > 0}
						down={i < categories.length - 1}
					/>
					{selectedCategory === c.id ? (
						<div className='px-4 py-6 flex gap-x-8 border'>
							<div className='flex-1'>
								<CategoryForm
									onSubmit={async (data) =>
										await onUpdateCategory({
											id: c.id,
											...data
										})
									}
									initialValues={c}
									errors={inputErrors}
								/>
							</div>
							<div>
								<button
									className='font-bold'
									onClick={() => onDeactivateCategory(c.id)}
								>
									remove
								</button>
							</div>
							<div>
								<button
									className='font-bold'
									onClick={() =>
										setSelectedCategory(undefined)
									}
								>
									cancel
								</button>
							</div>
						</div>
					) : (
						<div
							className='flex-1'
							onClick={() => setSelectedCategory(c.id)}
						>
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
		<div className='flex py-1 place-items-center cursor-pointer gap-x-4'>
			<CategoryDot colorHex={item.colorHex} />
			<div className='basis-12'>{item.abbreviation}</div>
			<div className='flex-1'>{item.name}</div>
		</div>
	)
}

function ChangeOrderArrows({
	onMoveUp,
	onMoveDown,
	up,
	down
}: {
	onMoveUp: () => void
	onMoveDown: () => void
	up: boolean
	down: boolean
}) {
	return (
		<div className='flex self-center gap-x-2 basis-11'>
			{up ? <FontAwesomeIcon icon='arrow-up' onClick={onMoveUp} /> : null}
			{down ? (
				<FontAwesomeIcon icon='arrow-down' onClick={onMoveDown} />
			) : null}
		</div>
	)
}
