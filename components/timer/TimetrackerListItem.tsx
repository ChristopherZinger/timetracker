import { useContext, useState } from 'react'
import type { TCategory } from '../../types/domains/Category'
import {
	Timetracker,
	TTracker,
	TTrackerInput
} from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'
import { AppError } from '../../utils/appError'
import { UserContext } from '../UserContext'
import TimetrackerForm from './TimetrackerForm'

type Props = {
	item: TTracker
	categories: TCategory[]
}

export default function TimetrackerListItem({ item, categories }: Props) {
	const formatTime = TimeUtils.timestampToHourMinute
	const [editMode, setEditMode] = useState(false)
	const { user } = useContext(UserContext)

	const editItem = async (data: TTrackerInput) => {
		if (!user) {
			throw new AppError('user_required_to_edit_tracker')
		}
		const timetracker = new Timetracker(user.uid)
		await timetracker.update({ id: item.id, ...data })
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
