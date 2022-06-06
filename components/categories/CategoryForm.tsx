import { FormEvent, useEffect, useState } from 'react'
import { TCategoryInput } from '../../types/domains/Category'

type Props = {
	onSubmit: (data: TCategoryInput) => Promise<void>
	initialValues?: Partial<TCategoryInput>
}

export default function CategoryForm({ onSubmit, initialValues = {} }: Props) {
	const [data, setData] = useState<TCategoryInput>({
		abbreviation: '',
		name: '',
		colorHex: '#FC5A03'
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
			<div className='flex gap-x-10'>
				<div className='flex-none flex gap-x-6'>
					<label htmlFor='abbreviation'>Abbreviation: </label>
					<input
						type='text'
						id='abbreviation'
						name='abbreviation'
						value={data.abbreviation}
						placeholder='e.g. CR'
						onChange={({ target }) =>
							setData((d) => ({
								...d,
								abbreviation: target.value
							}))
						}
					/>
				</div>
				<div className='flex-1 flex gap-x-6'>
					<label htmlFor='name'>Name: </label>
					<input
						type='text'
						id='name'
						name='name'
						placeholder='e.g. Core Responsibility'
						value={data.name}
						onChange={({ target }) =>
							setData((d) => ({ ...d, name: target.value }))
						}
					/>
				</div>
				<div className='flex-none'>
					<input
						type='color'
						id='color'
						name='color'
						value={data.colorHex}
						onChange={({ target }) => {
							console.log(target.value)
							setData((d) => ({ ...d, colorHex: target.value }))
						}}
					/>
				</div>
				<button type='submit'>
					<span className='font-bold'>save</span>
				</button>
			</div>
		</form>
	)
}
