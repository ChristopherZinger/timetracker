import type { User } from 'firebase/auth'
import { maxBy } from 'lodash'
import { useEffect, useState } from 'react'
import {
	TTracker,
	Timetracker,
	TTrackerInput
} from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'
import useGetActiveCategories from '../apiHooks/getActiveCategories'
import useGetTodaysTrackers from '../apiHooks/getTodaysTrackers'
import { useTick } from '../hooks/Tick'
import TimetrackerForm from './TimetrackerForm'
import TimetrackerList from './TimetrackerList'

type Props = {
	user: User
}

export default function TimetrackerPage({ user }: Props) {
	const [trackers, setTrackers] = useState<undefined | TTracker[]>(undefined)
	const [now, setNow] = useState<number>(new Date().getTime())
	const [nextTrackerStartTime, setNextTrackerStartTime] = useState<
		number | undefined
	>(undefined)
	const tick = useTick()
	const {
		data: categories,
		isLoading: isLoadingCategories,
		error: categoriesError
	} = useGetActiveCategories()
	const {
		data: todaysTrackers,
		isLoading: isLoadingTrackers,
		error: trackersError
	} = useGetTodaysTrackers()

	useEffect(() => {
		if (todaysTrackers) {
			if (todaysTrackers.length) {
				setTrackers(todaysTrackers)
				setItemStart(maxBy(todaysTrackers, 'end')?.end)
			} else {
				setTrackers([])
			}
		}
	}, [todaysTrackers])

	useEffect(() => {
		setNow(tick)
	}, [tick])

	const setItemStart = (timestamp?: number) => {
		setNextTrackerStartTime(timestamp || new Date().getTime())
	}

	const onUpdateTracker = async (tracker: TTracker) => {
		const timetracker = new Timetracker(user.uid)
		const updatedTracker = await timetracker.update(tracker)
		const newList = trackers?.map((t) =>
			t.id === updatedTracker.id ? updatedTracker : t
		)
		setTrackers(newList)
	}

	const onSubmitNewTracker = async (tracker: TTrackerInput) => {
		const timetracker = new Timetracker(user.uid)
		const newTracker = await timetracker.create(tracker)
		setItemStart(newTracker.end)
		const list = [...(trackers || []), newTracker]
		setTrackers(list)
	}
	if (isLoadingCategories || isLoadingTrackers) {
		return <div>loading data</div>
	}

	if (trackersError) {
		return <div>Could not load trackers for today.</div>
	}

	if (categoriesError) {
		return <div>Could not load categories.</div>
	}

	return (
		<div>
			<section>
				{trackers?.length && categories ? (
					<TimetrackerList
						list={trackers}
						categories={categories}
						onUpdateTracker={onUpdateTracker}
					/>
				) : null}
			</section>
			<hr />
			<section>
				{nextTrackerStartTime && categories?.length ? (
					<TimetrackerForm
						shouldSetEndToNow={true}
						onSubmit={onSubmitNewTracker}
						categories={categories}
						initialValues={{
							start: nextTrackerStartTime,
							categoryId: categories[0].id,
							end: new Date().getTime(),
							info: ''
						}}
					/>
				) : (
					<div>
						<button onClick={() => setItemStart()}>
							Start Day
						</button>
						<span>at: </span>{' '}
						<span>{TimeUtils.timestampToHourMinute(now)}</span>
					</div>
				)}
			</section>
		</div>
	)
}
