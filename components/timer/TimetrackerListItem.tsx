import { useState } from 'react'
import type { TCategory } from '../../types/domains/Category'
import type { TTracker } from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'
import TimetrackerForm from './TimetrackerForm'

type Props = {
	item: TTracker
	categories: TCategory[]
}

export default function TimetrackerListItem({ item, categories }: Props) {
	const formatTime = TimeUtils.timestampToHourMinute
	const [editMode, setEditMode] = useState(false)

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
						onSubmit={(data) => {
							console.log(data)
						}}
						categories={categories}
						initialValues={item}
					/>
				</div>
			) : null}
		</div>
	)
}
