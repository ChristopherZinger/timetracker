import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend)

export type DoughnutDataset = {
	labels: string[]
	datasets: [
		{
			data: number[]
			backgroundColor: string[]
		}
	]
}

type Props = {
	dataset: DoughnutDataset
}

export default function DoughnutChart({ dataset }: Props) {
	return (
		<Doughnut
			data={dataset}
			options={{
				plugins: {
					legend: {
						display: false
					}
				}
			}}
		/>
	)
}
