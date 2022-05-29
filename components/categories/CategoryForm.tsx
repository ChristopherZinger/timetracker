import { FormEvent, useEffect, useState } from 'react'
import { TCategoryInput } from '../../types/domains/Category'

type Props = {
	onSubmit: (data: TCategoryInput) => Promise<void>
	initialValues?: Partial<TCategoryInput>
}

export default function CategoryForm({ onSubmit, initialValues = {} }: Props) {
	const [data, setData] = useState<TCategoryInput>({
		abbreviation: '',
		name: ''
	})

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		await onSubmit(data)
	}

	useEffect(() => {
		setData((d) => ({
			...d,
			...initialValues
		}))
	}, [])

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor='abbreviation'>Abbreviation</label>
				<input
					type='text'
					id='abbreviation'
					name='abbreviation'
					value={data.abbreviation}
					onChange={({ target }) =>
						setData((d) => ({ ...d, abbreviation: target.value }))
					}
				/>
			</div>
			<div>
				<label htmlFor='name'>Name</label>
				<input
					type='text'
					id='name'
					name='name'
					value={data.name}
					onChange={({ target }) =>
						setData((d) => ({ ...d, name: target.value }))
					}
				/>
			</div>
			<button type='submit'>Submit</button>
		</form>
	)
}
