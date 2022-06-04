import { useContext, useState } from 'react'
import type { TCategory } from '../../types/domains/Category'
import { TTracker, TTrackerInput } from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'
import TimetrackerForm from './TimetrackerForm'

type Props = {
	item: TTracker
	categories: TCategory[]
	onUpdateTracker: (tracker: TTracker) => Promise<void>
}

export default function TimetrackerListItem({
	item,
	categories,
	onUpdateTracker
}: Props) {
	const formatTime = TimeUtils.timestampToHourMinute
	const [editMode, setEditMode] = useState(false)

	const editItem = async (data: TTrackerInput) => {
		await onUpdateTracker({ id: item.id, ...data })
		setEditMode(false)
	}

	return (
		<>
			{editMode ? (
				<div>
					<button onClick={() => setEditMode(false)}>close</button>
					<TimetrackerForm
						onSubmit={editItem}
						categories={categories}
						initialValues={item}
						hideStartInput={false}
					/>
				</div>
			) : (
				<div
					className='flex gap-x-8 py-4 px-6 cursor-pointer border border-white hover:border-zinc-200'
					onClick={() => setEditMode(true)}
				>
					<span className='flex-none'>
						{formatTime(item.start)}
						{' - '}
						{formatTime(item.end)}
					</span>
					<span className='flex-none'>
						{
							categories.find((c) => c.id === item.categoryId)
								?.abbreviation
						}
					</span>
					<span className='flex-1'>{item.info}</span>
				</div>
			)}
		</>
	)
}
