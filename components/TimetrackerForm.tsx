import { FormEvent, useEffect, useState } from 'react'
import { TCategory } from '../types/domains/Category'
import { TTrackerInput } from '../types/domains/Timetracker'

type Props = {
	start: number
	onSubmit: (data: TTrackerInput) => void
	categories: TCategory[]
}

const initialValues: TTrackerInput = {
	start: new Date().getTime(),
	end: new Date().getTime(),
	category: '',
	info: ''
}

export default function TimetrackerForm({
	start,
	onSubmit,
	categories
}: Props) {
	const [formValues, setFormValues] = useState<TTrackerInput>(initialValues)

	useEffect(() => {
		handleInputChange('start', start)
		handleInputChange('category', categories[0].id)
	}, [start, categories])

	const handleInputChange = (
		key: keyof TTrackerInput,
		value: string | Date | number
	) => {
		setFormValues((d) => ({ ...d, [key]: value }))
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		const finalData = {
			...formValues,
			end: new Date().getTime()
		}
		onSubmit(finalData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor='category'>Category</label>
				<select
					name='category'
					id='category'
					value={formValues.category}
					onChange={({ target }) =>
						handleInputChange('category', target.value)
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
