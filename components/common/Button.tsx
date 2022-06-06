type Props = {
	children?: React.ReactNode
	onClick: () => Promise<void> | void
}

export default function Button({ onClick, children }: Props) {
	return (
		<button onClick={onClick} className='border px-4 py-2 rounded'>
			{children}
		</button>
	)
}
