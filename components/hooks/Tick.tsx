import { useEffect, useState } from 'react'

export function useMinutes() {
	const [time, setTime] = useState(new Date())

	function didMinutePassed(lastDate: Date): boolean {
		return lastDate.getMinutes() !== new Date().getMinutes()
	}

	useEffect(() => {
		const interval = setInterval(() => {
			didMinutePassed(time) && setTime(new Date())
		}, 1000)
		return () => clearInterval(interval)
	}, [time])

	return time
}
