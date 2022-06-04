import { useContext, useState } from 'react'
import type { TCategory } from '../../types/domains/Category'
import { TTracker } from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'
import CategoryDot from '../categories/CategoryDot'
import { InputErrorsMap } from '../../types/utils/validator'
import TimetrackerForm from './TimetrackerForm'

type Props = {
	item: TTracker
	categories: TCategory[]
	onEdit: (data: TTracker) => Promise<void>
}

export default function TimetrackerListItem({
	item,
	categories,
	onEdit
}: Props) {
	const timeUtils = new TimeUtils()
	const [editMode, setEditMode] = useState(false)
	const category = categories.find((c) => c.id === item.categoryId)

	return (
		<>
			{editMode ? (
				<div>
					<button onClick={() => setEditMode(false)}>close</button>
					<TimetrackerForm
						onSubmit={(d) => onEdit({ ...d, id: item.id })}
						categories={categories}
						initialValues={item}
						hideStartInput={false}
						errors={{}} //! Pass real errors here
					/>
				</div>
			) : (
				<div
					className='flex gap-x-8 py-4 px-6 place-items-center cursor-pointer border border-white hover:border-zinc-200'
					onClick={() => setEditMode(true)}
				>
					<span className='flex-none'>
						{timeUtils.timestampToHourMinute(item.start)}
						{' - '}
						{timeUtils.timestampToHourMinute(item.end)}
					</span>
					<span>
						<CategoryDot colorHex={category?.colorHex || ''} />
					</span>
					<span className='flex-none'>{category?.abbreviation}</span>
					<span className='flex-1'>{item.info}</span>
				</div>
			)}
		</>
	)
}
