import { User } from 'firebase/auth'
import { Category } from '../../types/domains/Category'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'

type Props = {
	user: User
}

export default function Categories({ user }: Props) {
	return (
		<>
			<CategoryForm
				userId={user.uid}
				onSubmit={async (userId, data) => {
					const category = new Category(userId)
					// todo make sure data has all fields
					await category.create(data)
				}}
			/>
			<CategoryList userId={user.uid} />
		</>
	)
}
