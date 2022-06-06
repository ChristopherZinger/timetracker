import { DaySummary, TDaySummary } from '../../types/domains/DaySummary'
import useGetDaySummary from '../apiHooks/getDaySummary'
import Button from '../common/Button'
import LoadingBox from '../common/LoadingBox'
import DoughnutChart, { DoughnutDataset } from './DoughnutChart'
import DoughnutTileHeader from './DoughnutTileHeader'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

type Props = {
	date: Date
	userId: string
}

export default function DoughnutTile({ date, userId }: Props) {
	const { data, isLoading, error, reload } = useGetDaySummary(date)
	const daySummary = new DaySummary(userId)
	const isInTheFuture = dayjs(date).isAfter(new Date())
	const isToday = dayjs(date).isToday()

	async function regenerateDaySummary() {
		await daySummary.createDaySummaryForDate(date)
		await reload()
	}

	function convertDaySummaryToDoughnutDataset(
		data: TDaySummary
	): DoughnutDataset {
		const labelsValuesTuple = Object.values(
			data.summary.totalMinutesPerCategory
		).reduce(
			(acc, val): [string[], number[], string[]] => {
				return [
					[...acc[0], val.category.name],
					[...acc[1], val.nrOfMinutes],
					[...acc[2], val.category.colorHex]
				]
			},
			[[], [], []] as any
		)

		return {
			labels: labelsValuesTuple[0],
			datasets: [
				{
					data: labelsValuesTuple[1],
					backgroundColor: labelsValuesTuple[2]
				}
			]
		}
	}

	if (error) {
		return <div>Error while quering day summary.</div>
	}

	if (isLoading) {
		return <LoadingBox />
	}

	return (
		<div className={`${isToday ? 'border' : ''} shadow rounded p-4`}>
			<DoughnutTileHeader
				date={date}
				totalDayLengthInMinutes={data?.summary.totalDayLengthInMinutes}
				reload={regenerateDaySummary}
			/>
			<div>
				{data ? (
					<DoughnutChart
						dataset={convertDaySummaryToDoughnutDataset(data)}
					/>
				) : !isInTheFuture ? (
					<Button onClick={regenerateDaySummary}>
						Generate day summary
					</Button>
				) : null}
			</div>
		</div>
	)
}
