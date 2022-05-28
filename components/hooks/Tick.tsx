import { useEffect, useState } from 'react'

export function useTick() {
	const [tick, setTick] = useState(new Date().getTime())

	useEffect(() => {
		const interval = setInterval(() => {
			setTick(new Date().getTime())
		}, 1000)
		return () => clearInterval(interval)
	}, [tick])

	return tick
}
