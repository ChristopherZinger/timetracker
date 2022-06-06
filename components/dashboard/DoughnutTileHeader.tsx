import dayjs from 'dayjs'
import { TimeUtils } from '../../types/utils/time'

type Props = {
	totalDayLengthInMinutes?: number
	date: Date
	reload: () => void
}

export default function DoughnutTileHeader({
	totalDayLengthInMinutes,
	date,
	reload
}: Props) {
	const { minutesToHours } = new TimeUtils()
	return (
		<header className='flex justify-between'>
			<div>
				{dayjs(date).format('dddd')}
				{!dayjs().isBefore(date) ? (
					<span onClick={reload}> reload</span>
				) : null}
			</div>
			{totalDayLengthInMinutes ? (
				<div>
					total:{' '}
					<span className='font-bold'>
						{minutesToHours(totalDayLengthInMinutes)} h
					</span>
				</div>
			) : null}
		</header>
	)
}
