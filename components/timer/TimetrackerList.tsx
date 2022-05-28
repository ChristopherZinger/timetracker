import type { TTracker } from '../../types/domains/Timetracker'
import TimetrackerListItem from './TimetrackerListItem'

type Props = {
	list: TTracker[]
}

export default function TimetrackerList({ list }: Props) {
	return (
		<>
			{list.map((item, i) => (
				<TimetrackerListItem item={item} key={i} />
			))}
		</>
	)
}
