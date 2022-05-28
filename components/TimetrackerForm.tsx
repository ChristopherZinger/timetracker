import { FormEvent, useEffect, useState } from 'react'
import { TTrackerInput } from '../types/domains/Timetracker'

type Props = {
	start: number
	onSubmit: (data: TTrackerInput) => void
}

const initialValues: TTrackerInput = {
	start: new Date().getTime(),
	end: new Date().getTime(),
	category: 'asdf',
	info: ''
}

export default function TimetrackerForm({ start, onSubmit }: Props) {
	const [data, setData] = useState<TTrackerInput>(initialValues)

	const handleInputChange = (
		key: keyof TTrackerInput,
		value: string | Date | number
	) => {
		setData((d) => ({ ...d, [key]: value }))
	}

	useEffect(() => {
		handleInputChange('start', start)
	}, [])

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		const finalData = {
			...data,
			end: new Date().getTime()
		}
		onSubmit(data)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<input
					type='time'
					id='start'
					name='start'
					value={data.start}
					onChange={({ target }) => {
						return
						handleInputChange('start', target.value)
					}}
					hidden
				/>
			</div>
			<div>
				<label htmlFor='category'>Category</label>
				<input
					type='text'
					id='category'
					name='category'
					value={data.category}
					onChange={({ target }) =>
						handleInputChange('category', target.value)
					}
				/>
			</div>
			<div>
				<label htmlFor='info'>Info</label>
				<input
					type='text'
					id='info'
					name='info'
					value={data.info}
					onChange={({ target }) =>
						handleInputChange('info', target.value)
					}
				/>
			</div>
			<button type='submit'>go!</button>
		</form>
	)
}
