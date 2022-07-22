import type { User } from 'firebase/auth'
import { maxBy } from 'lodash'
import { useEffect, useState } from 'react'
import { Timetracker, TTrackerInput } from '../../types/domains/Timetracker'
import { InputErrorsMap } from '../../types/utils/validator'
import useGetActiveCategories from '../apiHooks/getActiveCategories'
import useGetTrackersForDay from '../apiHooks/getTrackersForDay'
import LoadingBox from '../common/LoadingBox'
import TimetrackerForm from './TimetrackerForm'
import TimetrackerList from './TimetrackerList'
import TimetrackerSelectedDateController from './TimetrackerSelectedDateController'
import { TimeUtils } from '../../types/utils/time'
import { DaySummary } from '../../types/domains/DaySummary'
import useGetDaySummary from '../apiHooks/getDaySummary'
import DoughnutTile from '../dashboard/DoughnutTile'

type Props = {
	user: User
}

export default function TimetrackerPage({ user }: Props) {
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [timetrackerFormErrors, setTimetrackerFormErrors] =
		useState<InputErrorsMap>({})
	const {
		data: categories,
		isLoading: isLoadingCategories,
		error: categoriesError
	} = useGetActiveCategories()
	const {
		data: trackersForSelectedDate,
		isLoading: isLoadingTrackers,
		error: trackersError,
		reload: reloadTrackersForDate
	} = useGetTrackersForDay(selectedDate)
	const [initialValues, setInitialValues] = useState<TTrackerInput>({
		start: selectedDate.getTime(),
		categoryId: '',
		end: selectedDate.getTime(),
		info: ''
	})
	const { reload: loadDaySummaryForSelectedDate } =
		useGetDaySummary(selectedDate)
	const timetracker = new Timetracker(user.uid)
	const timeUtils = new TimeUtils()
	const daySummary = new DaySummary(user.uid)

	function setItemStart(timestamp: number) {
		setInitialValues((v) => ({
			...v,
			start: timestamp
		}))
	}

	useEffect(() => {
		const d = maxBy(trackersForSelectedDate || [], 'end')
		if (d) {
			setInitialValues((v) => ({
				...v,
				start: d.end,
				end: new Date().getTime()
			}))
		} else {
			setInitialValues((v) => ({
				...v,
				start: selectedDate.getTime(),
				end: selectedDate.getTime()
			}))
		}
	}, [trackersForSelectedDate])

	useEffect(() => {
		if (categories?.length) {
			setInitialValues((v) => ({ ...v, categoryId: categories[0].id }))
		}
	}, [categories])

	if (isLoadingCategories || isLoadingTrackers) {
		return <LoadingBox />
	}

	if (trackersError) {
		return <div>Could not load trackers for today.</div>
	}

	if (categoriesError || !categories?.length) {
		return <div>Could not load categories.</div>
	}

	return (
		<div className='mb-20 mt-10 px-10 flex flex-1 gap-x-12 '>
			<div className='flex flex-col  gap-y-8 w-9/12'>
				<section className='relative flex-1'>
					<div className='absolute h-full overflow-auto w-full'>
						{trackersForSelectedDate?.length && categories ? (
							<TimetrackerList
								list={trackersForSelectedDate}
								categories={categories}
								onTrackerUpdate={async () => {
									await daySummary.createOrUpdateDaySummaryForDate(
										selectedDate
									)
									reloadTrackersForDate(selectedDate)
								}}
								userId={user.uid}
							/>
						) : null}
					</div>
				</section>

				<section className='flex-none'>
					<TimetrackerForm
						shouldSetEndToNow={timeUtils.isToday(selectedDate)}
						onSubmit={async (data) => {
							const errors = await timetracker.create(data)
							await daySummary.createOrUpdateDaySummaryForDate(
								selectedDate
							)
							if (errors) {
								setTimetrackerFormErrors(errors)
							} else {
								setTimetrackerFormErrors({})
								setItemStart(data.end)
								await reloadTrackersForDate(selectedDate)
							}
						}}
						errors={timetrackerFormErrors}
						categories={categories}
						initialValues={initialValues}
					/>
				</section>
			</div>
			<div className='flex-1'>
				<section className='mb-10'>
					<TimetrackerSelectedDateController
						selectedDate={selectedDate}
						onDateChange={(date) => {
							setSelectedDate(date)
							loadDaySummaryForSelectedDate(date)
						}}
					/>
				</section>
				{selectedDate ? (
					<DoughnutTile date={selectedDate} userId={user.uid} />
				) : null}
			</div>
		</div>
	)
}
