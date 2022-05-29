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
}

export default function TimetrackerForm({
	initialValues,
	onSubmit,
	categories,
	shouldSetEndToNow = false
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
			<div>
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
			<div>
				<label htmlFor='category'>Category</label>
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
			<div>
				<label htmlFor='info'>Info</label>
				<input
					type='text'
					id='info'
					name='info'
					value={formValues.info}
					onChange={({ target }) =>
						handleInputChange('info', target.value)
					}
				/>
			</div>
			<button type='submit'>go!</button>
		</form>
	)
}
