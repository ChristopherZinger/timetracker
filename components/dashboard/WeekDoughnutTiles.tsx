import dayjs from 'dayjs'
import DoughnutTile from './DoughnutTile'

type Props = {
	userId: string
}

export default function WeekDoughnutTiles({ userId }: Props) {
	return (
		<div className='flex-1 p-10'>
			<div className='grid gap-8 grid-cols-4 grid-rows-2 flex-1'>
				{Array.from(Array(7)).map((_, dayIndex) => (
					<DoughnutTile
						date={dayjs()
							.day(dayIndex + 1)
							.toDate()}
						userId={userId}
						key={dayIndex}
					/>
				))}
			</div>
		</div>
	)
}
