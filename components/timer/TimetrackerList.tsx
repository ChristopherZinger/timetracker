import type { TCategory } from '../../types/domains/Category'
import { Timetracker, TTracker } from '../../types/domains/Timetracker'
import TimetrackerListItem from './TimetrackerListItem'

type Props = {
	list: TTracker[]
	categories: TCategory[]
	onTrackerUpdate: () => Promise<void>
	userId: string
}

export default function TimetrackerList({
	list,
	categories,
	onTrackerUpdate,
	userId
}: Props) {
	const timetracker = new Timetracker(userId)

	async function _onTrackerUpdate(tracker: TTracker) {
		await timetracker.update(tracker)
		await onTrackerUpdate()
	}

	return (
		<>
			{list.map((item) => (
				<TimetrackerListItem
					item={item}
					key={item.id}
					categories={categories}
					onEdit={_onTrackerUpdate}
				/>
			))}
		</>
	)
}
