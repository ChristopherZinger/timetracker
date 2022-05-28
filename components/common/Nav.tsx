import { getAuth, signOut } from 'firebase/auth'
import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../UserContext'

const Nav = () => {
	const { user } = useContext(UserContext)

	return (
		<nav>
			<ul>
				{user && (
					<>
						<li>
							<Link href={'/timetracker'}>timetracker</Link>
						</li>
						<li>
							<Link href={'/categories'}>categories</Link>
						</li>
						<li>
							<span
								onClick={() => {
									signOut(getAuth())
								}}
							>
								logout
							</span>
						</li>
					</>
				)}
				{!user && (
					<>
						<li>
							<Link href={'/'}>home</Link>
						</li>
						<li>
							<Link href={'/login'}>login</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	)
}

export default Nav
