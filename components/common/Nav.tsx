import { getAuth, signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { BASE_URL } from '../../types/baseUrls'
import { UserContext } from '../UserContext'
import NavItem from './NavItem'

const Nav = () => {
	const { user } = useContext(UserContext)
	const { asPath } = useRouter()

	const isLinkActive = (link: BASE_URL): boolean => asPath.slice(1) === link

	return (
		<nav className='flex justify-between px-12 py-12 shadow-md shadow-gray-100'>
			<ul className='flex gap-x-8'>
				{user ? (
					<NavItem isActive={isLinkActive(BASE_URL.timetracker)}>
						<Link href={`/${BASE_URL.timetracker}`}>home</Link>
					</NavItem>
				) : null}
			</ul>

			<ul className='flex gap-x-8'>
				{user ? (
					<>
						<NavItem isActive={isLinkActive(BASE_URL.categories)}>
							<Link href={`/${BASE_URL.categories}`}>
								categories
							</Link>
						</NavItem>
						<NavItem>
							<span
								className='a'
								onClick={() => {
									signOut(getAuth())
								}}
							>
								logout
							</span>
						</NavItem>
					</>
				) : (
					<NavItem isActive={isLinkActive(BASE_URL.login)}>
						<Link href={`/${BASE_URL.login}`}>login</Link>
					</NavItem>
				)}
			</ul>
		</nav>
	)
}

export default Nav
