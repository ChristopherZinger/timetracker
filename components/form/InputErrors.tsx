import { InputErrorsMap } from '../../types/utils/validator'

export default function InputErrors({
	errors,
	name
}: {
	errors: InputErrorsMap
	name: string
}) {
	return (
		<>
			{errors[name] ? (
				<div className='text-red-500 flex flex-col'>
					{errors[name].map((e) => (
						<div>* {e}</div>
					))}
				</div>
			) : null}
		</>
	)
}
