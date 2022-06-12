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
import dayjs from 'dayjs'
import TimetrackerSelectedDateController from './TimetrackerSelectedDateController'

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
		reload
	} = useGetTrackersForDay(selectedDate)
	const [initialValues, setInitialValues] = useState<TTrackerInput>({
		start: selectedDate.getTime(),
		categoryId: '',
		end: selectedDate.getTime(),
		info: ''
	})
	const timetracker = new Timetracker(user.uid)

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
				end: d.end
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
		<div className='w-9/12 mx-auto mb-20 mt-10 px-10 gap-y-8 flex flex-col flex-1 '>
			<section>
				<TimetrackerSelectedDateController
					selectedDate={selectedDate}
					onDateChange={(date) => setSelectedDate(date)}
				/>
			</section>
			<section className='relative flex-1'>
				<div className='absolute h-full overflow-auto w-full'>
					{trackersForSelectedDate?.length && categories ? (
						<TimetrackerList
							list={trackersForSelectedDate}
							categories={categories}
							reload={() => reload(selectedDate)}
							userId={user.uid}
						/>
					) : null}
				</div>
			</section>

			<section className='flex-none'>
				<TimetrackerForm
					shouldSetEndToNow={dayjs(selectedDate).isToday()}
					onSubmit={async (data) => {
						const errors = await timetracker.create(data)
						if (errors) {
							setTimetrackerFormErrors(errors)
						} else {
							setTimetrackerFormErrors({})
							setItemStart(data.end)
							reload(selectedDate)
						}
					}}
					errors={timetrackerFormErrors}
					categories={categories}
					initialValues={initialValues}
				/>
			</section>
		</div>
	)
}
