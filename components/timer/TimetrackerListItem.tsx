import type { TCategory } from '../../types/domains/Category'
import type { TTrackerInput } from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'

type Props = {
	item: TTrackerInput
	categories: TCategory[]
}

export default function TimetrackerListItem({ item, categories }: Props) {
	const formatTime = TimeUtils.timestampToHourMinute

	return (
		<div>
			<span>{formatTime(item.start)}</span> -
			<span>{formatTime(item.end)}</span>|{' '}
			<span>
				{categories.find((c) => c.id === item.categoryId)?.abbreviation}
			</span>{' '}
			| <span>{item.info}</span>
		</div>
	)
}
