import DoughnutTile from './DoughnutTile'
import dayjs from 'dayjs'

type Props = {
	userId: string
	date: Date
}

export default function WeekDoughnutTiles({ userId, date }: Props) {
	return (
		<div className='flex-1 p-10'>
			<div className='grid gap-8 grid-cols-4 grid-rows-2 flex-1'>
				{Array.from(Array(7)).map((_, dayIndex) => (
					<DoughnutTile
						date={dayjs(date).weekday(dayIndex).toDate()}
						userId={userId}
						key={dayIndex}
					/>
				))}
			</div>
		</div>
	)
}
