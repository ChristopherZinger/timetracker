export default function ({ colorHex }: { colorHex: string }) {
	return (
		<div
			className={'w-4 h-4 rounded-full'}
			style={{ backgroundColor: colorHex }}
		></div>
	)
}
