import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from './UserContext'

const Nav = () => {
	const { user } = useContext(UserContext)

	return (
		<nav>
			<ul>
				<li>
					<Link href={'/'}>home</Link>
				</li>
				<li>
					<Link href={'/login'}>login</Link>
				</li>
				{user && (
					<li>
						<Link href={'/timetracker'}>timetracker</Link>
					</li>
				)}
			</ul>
		</nav>
	)
}

export default Nav
