import type { TCategory } from '../../types/domains/Category'
import type { TTracker } from '../../types/domains/Timetracker'
import TimetrackerListItem from './TimetrackerListItem'

type Props = {
	list: TTracker[]
	categories: TCategory[]
}

export default function TimetrackerList({ list, categories }: Props) {
	return (
		<>
			{list.map((item, i) => (
				<TimetrackerListItem
					item={item}
					key={i}
					categories={categories}
				/>
			))}
		</>
	)
}
