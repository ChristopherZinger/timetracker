import type { TCategory } from '../../types/domains/Category'
import { Timetracker, TTracker } from '../../types/domains/Timetracker'
import TimetrackerListItem from './TimetrackerListItem'

type Props = {
	list: TTracker[]
	categories: TCategory[]
	onTrackerUpdate: () => Promise<void>
	userId: string
	onRemoveTracker: () => Promise<void>
}

export default function TimetrackerList({
	list,
	categories,
	onTrackerUpdate,
	userId,
	onRemoveTracker
}: Props) {
	const timetracker = new Timetracker(userId)

	async function _onTrackerUpdate(tracker: TTracker) {
		await timetracker.update(tracker)
		await onTrackerUpdate()
	}

	async function _onRemove(tracker: TTracker) {
		await timetracker.remove(tracker)
		await onRemoveTracker()
	}

	return (
		<>
			{list.map((item) => (
				<TimetrackerListItem
					item={item}
					key={item.id}
					categories={categories}
					onEdit={_onTrackerUpdate}
					onRemove={_onRemove}
				/>
			))}
		</>
	)
}
