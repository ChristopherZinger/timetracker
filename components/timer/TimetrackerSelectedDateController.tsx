import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TimeUtils } from '../../types/utils/time'

type Props = {
	onDateChange: (date: Date) => void
	selectedDate: Date
}

export default function TimetrackerSelectedDateController({
	onDateChange,
	selectedDate
}: Props) {
	function getDateDayBefore(date: Date): Date {
		return new Date(date.setDate(date.getDate() - 1))
	}

	function getDateDayAfter(date: Date): Date {
		const yesturday = new Date(new Date().setDate(new Date().getDate() - 1))
		return dayjs(date).isAfter(yesturday)
			? date
			: new Date(date.setDate(date.getDate() + 1))
	}
	const timeUtils = new TimeUtils()

	const isSelectedDateToday = timeUtils.isToday(selectedDate)

	return (
		<nav className='flex gap-x-10'>
			<button
				onClick={() => onDateChange(getDateDayBefore(selectedDate))}
			>
				<FontAwesomeIcon icon='arrow-left' />
			</button>
			<button onClick={() => onDateChange(new Date())}>
				{!isSelectedDateToday ? 'go to ' : ''}
				<span
					className={`${
						isSelectedDateToday ? 'font-bold underline' : ''
					}`}
				>
					Today
				</span>
			</button>
			{isSelectedDateToday ? null : (
				<button
					onClick={() => onDateChange(getDateDayAfter(selectedDate))}
				>
					<FontAwesomeIcon icon='arrow-right' />
				</button>
			)}
			<input
				type='date'
				name='date'
				id='date'
				max={new Date().toISOString().split('T')[0]}
				onChange={({ target: { value } }) => {
					const hour = new Date().getHours()
					onDateChange(dayjs(value).set('hours', hour).toDate())
				}}
				value={dayjs(selectedDate).format('YYYY-MM-DD')}
			/>
		</nav>
	)
}
