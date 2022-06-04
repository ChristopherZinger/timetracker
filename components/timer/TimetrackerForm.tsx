import { FormEvent, useEffect, useState } from 'react'
import { TCategory } from '../../types/domains/Category'
import { TTrackerInput } from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'
import { useTick } from '../hooks/Tick'

type Props = {
	initialValues: TTrackerInput
	onSubmit: (data: TTrackerInput) => void
	categories: TCategory[]
	shouldSetEndToNow?: boolean
	hideStartInput?: boolean
}

export default function TimetrackerForm({
	initialValues,
	onSubmit,
	categories,
	shouldSetEndToNow = false,
	hideStartInput = true
}: Props) {
	const [formValues, setFormValues] = useState<TTrackerInput>(initialValues)
	const [shouldTickRun, setShouldTickRun] = useState(shouldSetEndToNow)
	const stopTick = () => setShouldTickRun(false)
	const startTick = () => setShouldTickRun(true)
	const tick = useTick()

	useEffect(() => {
		shouldTickRun && handleInputChange('end', new Date().getTime())
	}, [tick])

	const handleInputChange = (
		key: keyof TTrackerInput,
		value: string | Date | number
	) => {
		setFormValues((d) => ({ ...d, [key]: value }))
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		onSubmit(formValues)
		startTick()
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='flex px-6 py-4 gap-x-8 border'>
				{hideStartInput ? null : (
					<div className='flex'>
						<input
							type='time'
							name='start'
							id='start'
							value={TimeUtils.timestampToHourMinute(
								formValues.start
							)}
							onChange={({ target }) => {
								const [hours, minutes] = target.value.split(':')
								const date = new Date()
								date.setHours(parseInt(hours)) // todo validate hours before
								date.setMinutes(parseInt(minutes))
								handleInputChange('start', date.getTime())
							}}
						/>
					</div>
				)}
				<div className='flex-none'>
					<input
						type='time'
						name='end'
						id='end'
						value={TimeUtils.timestampToHourMinute(formValues.end)}
						onChange={({ target }) => {
							stopTick()
							const [hours, minutes] = target.value.split(':')
							const date = new Date()
							date.setHours(parseInt(hours)) // todo validate hours before
							date.setMinutes(parseInt(minutes))
							handleInputChange('end', date.getTime())
						}}
					/>
				</div>
				<div className='flex-none'>
					<select
						name='category'
						id='category'
						value={formValues.categoryId}
						onChange={({ target }) =>
							handleInputChange('categoryId', target.value)
						}
					>
						{categories?.length &&
							categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.abbreviation}
								</option>
							))}
					</select>
				</div>
				<div className='flex-1'>
					<input
						className='w-full'
						type='text'
						id='info'
						name='info'
						placeholder='Put some info here'
						value={formValues.info}
						onChange={({ target }) =>
							handleInputChange('info', target.value)
						}
					/>
				</div>

				<div className='flex-none'>
					<button type='submit'>
						<span className='font-bold'>Submit</span>
					</button>
				</div>
			</div>
		</form>
	)
}
