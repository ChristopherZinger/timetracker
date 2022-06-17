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
	const timeUtils = new TimeUtils()

	return (
		<header className='flex justify-between'>
			<div>
				{timeUtils.getDateInFormat(date, 'MMM /  DD ddd')}
				{!timeUtils.isAfterToday(date) ? (
					<span onClick={reload}> reload</span>
				) : null}
			</div>
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
