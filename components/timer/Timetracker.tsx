import type { User } from 'firebase/auth'
import { maxBy } from 'lodash'
import { useEffect, useState } from 'react'
import { Timetracker } from '../../types/domains/Timetracker'
import useGetActiveCategories from '../apiHooks/getActiveCategories'
import useGetTodaysTrackers from '../apiHooks/getTodaysTrackers'
import LoadingBox from '../common/LoadingBox'
import StartDayBtn from './StartDayBtn'
import TimetrackerForm from './TimetrackerForm'
import TimetrackerList from './TimetrackerList'

type Props = {
	user: User
}

export default function TimetrackerPage({ user }: Props) {
	const [nextTrackerStartTime, setNextTrackerStartTime] = useState<
		number | undefined
	>(undefined)
	const {
		data: categories,
		isLoading: isLoadingCategories,
		error: categoriesError
	} = useGetActiveCategories()
	const {
		data: todaysTrackers,
		isLoading: isLoadingTrackers,
		error: trackersError,
		reload
	} = useGetTodaysTrackers()
	const timetracker = new Timetracker(user.uid)

	useEffect(() => {
		if (todaysTrackers?.length) {
			setItemStart(maxBy(todaysTrackers, 'end')?.end)
		}
	}, [todaysTrackers])

	const setItemStart = (timestamp?: number) => {
		setNextTrackerStartTime(timestamp || new Date().getTime())
	}

	if (isLoadingCategories || isLoadingTrackers) {
		return <LoadingBox />
	}

	if (trackersError) {
		return <div>Could not load trackers for today.</div>
	}

	if (categoriesError) {
		return <div>Could not load categories.</div>
	}

	return (
		<div className='w-9/12 mx-auto mb-20 mt-10 px-10 gap-y-8 flex flex-col flex-1 '>
			<section className='relative flex-1'>
				<div className='absolute h-full overflow-auto w-full'>
					{todaysTrackers?.length && categories ? (
						<TimetrackerList
							list={todaysTrackers}
							categories={categories}
							reload={reload}
							userId={user.uid}
						/>
					) : null}
				</div>
			</section>

			<section className='flex-none'>
				{nextTrackerStartTime && categories?.length ? (
					<TimetrackerForm
						shouldSetEndToNow={true}
						onSubmit={async (data) => {
							await timetracker.create(data)
							setItemStart(data.end)
							reload()
						}}
						categories={categories}
						initialValues={{
							start: nextTrackerStartTime,
							categoryId: categories[0].id,
							end: new Date().getTime(),
							info: ''
						}}
					/>
				) : (
					<StartDayBtn
						onClick={() => setItemStart(new Date().getTime())}
					/>
				)}
			</section>
		</div>
	)
}
