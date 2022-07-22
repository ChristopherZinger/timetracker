import { TimeUtils } from '../../types/utils/time'

type Props = {
	totalDayLengthInMinutes?: number
	date: Date
}

export default function DoughnutTileHeader({
	totalDayLengthInMinutes,
	date
}: Props) {
	const timeUtils = new TimeUtils()

	return (
		<header className='flex justify-between'>
			<div>{timeUtils.getDateInFormat(date, 'MMM /  DD ddd')}</div>
			{totalDayLengthInMinutes ? (
				<div>
					total:{' '}
					<span className='font-bold'>
						{timeUtils.minutesToHours(totalDayLengthInMinutes)} h
					</span>
				</div>
			) : null}
		</header>
	)
}
