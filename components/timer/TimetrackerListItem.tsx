import { TTrackerInput } from '../../types/domains/Timetracker'

type Props = {
	item: TTrackerInput
}

export default function TimetrackerListItem({ item }: Props) {
	return (
		<div>
			<span>{item.category}</span>
			<span>{item.info}</span>
		</div>
	)
}
