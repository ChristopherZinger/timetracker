import { createContext, useState } from 'react'
import { getAuth, User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'

type UserStatus = User | undefined | null

const UserContext = createContext<{
	user: UserStatus
	setUser: (user: User) => void
}>({
	user: undefined,
	setUser: (user) => {}
}) // undefined means it is loading
type Props = {
	children: React.ReactNode
}

const UserProvider = ({ children }: Props) => {
	const auth = getAuth()
	const [user, setUser] = useState<UserStatus>(undefined)
	const { push } = useRouter()

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
