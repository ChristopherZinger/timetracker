import { getAuth, signOut } from 'firebase/auth'
import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../UserContext'

const Nav = () => {
	const { user } = useContext(UserContext)

	return (
		<nav className='flex justify-between px-12 py-12 shadow-md shadow-gray-100'>
			<ul className='flex gap-x-8'>
				{user ? (
					<li>
						<Link href={'/timetracker'}>home</Link>
					</li>
				) : (
					<>
						<li>
							<Link href={'/'}>home</Link>
						</li>
					</>
				)}
			</ul>

			<ul className='flex gap-x-8'>
				{user ? (
					<>
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
				) : (
					<li>
						<Link href={'/login'}>login</Link>
					</li>
				)}
			</ul>
		</nav>
	)
}

export default Nav
