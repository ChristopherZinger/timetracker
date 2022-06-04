import { useRouter } from 'next/router'

type Props = {
	children: React.ReactNode
	isActive?: boolean
}

export default function NavItem({ children, isActive }: Props) {
	return (
		<li className={`text-md font-semibold ${isActive ? 'underline' : ''}`}>
			{children}
		</li>
	)
}
