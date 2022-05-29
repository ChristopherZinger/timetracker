import { createContext, useState } from 'react'
import { getAuth, User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'

type UserStatus = User | undefined | null // undefined = loading user

const UserContext = createContext<{
	user: UserStatus
	setUser: (user: User) => void
}>({
	user: undefined,
	setUser: (user) => {}
})
type Props = {
	children: React.ReactNode
}

const UserProvider = ({ children }: Props) => {
	const auth = getAuth()
	const [user, setUser] = useState<UserStatus>(undefined)

	onAuthStateChanged(auth, (_user) => {
		setUser(_user)
	})

	return (
		<>
			{user === undefined ? (
				<div>loading</div>
			) : (
				<UserContext.Provider value={{ user: user, setUser }}>
					{children}
				</UserContext.Provider>
			)}
		</>
	)
}

export { UserProvider, UserContext }
