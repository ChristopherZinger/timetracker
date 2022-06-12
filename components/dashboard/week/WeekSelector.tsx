import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toInteger } from 'lodash'
import dayjs from 'dayjs'

type Props = {
	onWeekChange: (date: Date) => void
	selectedDate: Date
}

export default function WeekSelector({ onWeekChange, selectedDate }: Props) {
	const isSelcectedDateCurrentWeek =
		toInteger(dayjs().week()) <= toInteger(dayjs(selectedDate).week())

	function getNextWeek(date: Date) {
		return isSelcectedDateCurrentWeek
			? date
			: dayjs(date)
					.week(dayjs(date).week() + 1)
					.toDate()
	}

	function getPreviousWeek(date: Date) {
		return dayjs(date)
			.week(dayjs(date).week() - 1)
			.toDate()
	}

	function onWeekSelect(yearWeek: string) {
		const [year, week] = getWeekAndYearFromWeekString(yearWeek)
		onWeekChange(dayjs(selectedDate).year(year).week(week).day(1).toDate())
	}

	function convertDateToWeekString(date: Date) {
		const week = toInteger(dayjs(date).week())
		const weekStr = week < 10 ? `0${week}` : `${week}`
		return dayjs(date).format('YYYY') + '-W' + weekStr
	}

	function getWeekAndYearFromWeekString(weekString: string) {
		const [year, week] = weekString
			.replace('-', '')
			.split('W')
			.map((str) => toInteger(str))
		return [year, week]
	}

	return (
		<div className='flex gap-x-10'>
			<button onClick={() => onWeekChange(getPreviousWeek(selectedDate))}>
				<FontAwesomeIcon icon='arrow-left' /> previous week
			</button>
			{isSelcectedDateCurrentWeek ? null : (
				<button onClick={() => onWeekChange(getNextWeek(selectedDate))}>
					next week <FontAwesomeIcon icon='arrow-right' />
				</button>
			)}
			<input
				type='week'
				max={convertDateToWeekString(new Date())}
				value={convertDateToWeekString(selectedDate)}
				onChange={({ target: { value } }) => onWeekSelect(value)}
			/>
		</div>
	)
}
