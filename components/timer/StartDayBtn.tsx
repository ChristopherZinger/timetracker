import { useEffect, useState } from 'react'
import { TimeUtils } from '../../types/utils/time'
import { useTick } from '../hooks/Tick'

type Props = {
	onClick: () => void
}

export default function StartDayBtn({ onClick }: Props) {
	const [now, setNow] = useState<number>(new Date().getTime())
	const tick = useTick()

	useEffect(() => {
		setNow(tick)
	}, [tick])

	return (
		<div>
			<button onClick={onClick}>
				<span className='font-bold'>Start Day</span>
			</button>
			<span>at: </span>
			<span>{TimeUtils.timestampToHourMinute(now)}</span>
		</div>
	)
}