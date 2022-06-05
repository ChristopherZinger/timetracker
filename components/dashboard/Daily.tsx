import { useState } from 'react'
import { DaySummary } from '../../types/domains/DaySummary'

type Props = {
	userId: string
}

export default function Daily({ userId }: Props) {
	const [date, setDate] = useState<Date | undefined>()

	return (
		<div>
			<div className='flex-1 p-10'>
				<h1>Dashboard</h1>
				<input
					type='date'
					name='date'
					id='id'
					onChange={({ target: { value } }) =>
						setDate(new Date(value))
					}
				/>
				{date ? (
					<button
						onClick={() => {
							const summary = new DaySummary(userId)
							summary.createDaySummryForDate(date)
						}}
						className='border px-4 py-2 rounded'
					>
						create date for {date?.toDateString()}
					</button>
				) : null}
			</div>
		</div>
	)
}
