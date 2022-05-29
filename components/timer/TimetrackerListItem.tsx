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
		<div>
			<span>{formatTime(item.start)}</span> -
			<span>{formatTime(item.end)}</span>|{' '}
			<span>
				{categories.find((c) => c.id === item.categoryId)?.abbreviation}
			</span>{' '}
			| <span>{item.info}</span>
			<button onClick={() => setEditMode((f) => !f)}>
				{editMode ? 'close' : 'edit'}
			</button>
			{editMode ? (
				<div>
					<TimetrackerForm
						onSubmit={editItem}
						categories={categories}
						initialValues={item}
						hideStartInput={false}
					/>
				</div>
			) : null}
		</div>
	)
}
