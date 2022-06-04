import type { TCategory } from '../../types/domains/Category'
import { Timetracker, TTracker } from '../../types/domains/Timetracker'
import TimetrackerListItem from './TimetrackerListItem'

type Props = {
	list: TTracker[]
	categories: TCategory[]
	reload: () => Promise<void>
	userId: string
}

export default function TimetrackerList({
	list,
	categories,
	reload,
	userId
}: Props) {
	const timetracker = new Timetracker(userId)

	async function onTrackerUpdate(tracker: TTracker) {
		await timetracker.update(tracker)
		await reload()
	}

	return (
		<>
			{list.map((item) => (
				<TimetrackerListItem
					item={item}
					key={item.id}
					categories={categories}
					onEdit={onTrackerUpdate}
				/>
			))}
		</>
	)
}
