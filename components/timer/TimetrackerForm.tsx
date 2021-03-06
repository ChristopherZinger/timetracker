import { FormEvent, useEffect, useState } from 'react'
import { TCategory } from '../../types/domains/Category'
import { TTrackerInput } from '../../types/domains/Timetracker'
import { TimeUtils } from '../../types/utils/time'
import { useMinutes } from '../hooks/Tick'
import { InputErrorsMap } from '../../types/utils/validator'
import InputErrors from '../form/InputErrors'

type Props = {
	initialValues: TTrackerInput
	onSubmit: (data: TTrackerInput) => void
	categories: TCategory[]
	shouldSetEndToNow?: boolean
	hideStartInput?: boolean
	errors: InputErrorsMap
}

export default function TimetrackerForm({
	initialValues,
	onSubmit,
	categories,
	errors,
	shouldSetEndToNow = false
}: Props) {
	const [formValues, setFormValues] = useState<TTrackerInput>(initialValues)
	const [shouldTickRun, setShouldTickRun] = useState(shouldSetEndToNow)
	const stopTick = () => setShouldTickRun(false)
	const startTick = () => setShouldTickRun(true)
	const tick = useMinutes()
	const timeUtils = new TimeUtils()

	useEffect(() => {
		setFormValues(initialValues)
	}, [initialValues])

	useEffect(() => {
		shouldTickRun && setEndTimeToNow()
	}, [tick])

	function setEndTimeToNow() {
		handleInputChange('end', new Date().getTime())
	}

	const handleInputChange = (
		key: keyof TTrackerInput,
		value: string | Date | number
	) => {
		setFormValues((d) => ({ ...d, [key]: value }))
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		onSubmit(formValues)
		shouldTickRun && startTick()
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='flex px-6 py-4 gap-x-8 border'>
				<div className='flex'>
					<input
						type='time'
						name='start'
						id='start'
						value={timeUtils.timestampToHourMinute(
							formValues.start
						)}
						onChange={({ target }) => {
							const [hours, minutes] = target.value.split(':')
							const date = new Date(formValues.start)
							date.setHours(parseInt(hours)) // todo validate hours before
							date.setMinutes(parseInt(minutes))
							handleInputChange('start', date.getTime())
						}}
					/>
					<InputErrors errors={errors} name='start' />
				</div>
				<div className='flex-none'>
					<input
						type='time'
						name='end'
						id='end'
						value={timeUtils.timestampToHourMinute(formValues.end)}
						onChange={({ target }) => {
							stopTick()
							const [hours, minutes] = target.value.split(':')
							const date = new Date(formValues.end)
							date.setHours(parseInt(hours)) // todo validate hours before
							date.setMinutes(parseInt(minutes))
							handleInputChange('end', date.getTime())
						}}
					/>
					<InputErrors errors={errors} name='end' />
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
					<InputErrors errors={errors} name='category' />
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
					<InputErrors errors={errors} name='info' />
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
