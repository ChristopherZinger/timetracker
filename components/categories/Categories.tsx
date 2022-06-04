import { User } from 'firebase/auth'
import { Category } from '../../types/domains/Category'
import useGetActiveCategories from '../apiHooks/getActiveCategories'
import LoadingBox from '../common/LoadingBox'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'

type Props = {
	user: User
}

export default function Categories({ user }: Props) {
	const {
		data: categoriesFromDb,
		isLoading,
		reload
	} = useGetActiveCategories()
	const category = new Category(user.uid)

	return (
		<div className='w-9/12 mx-auto mb-20 mt-10 px-10 gap-y-8'>
			<h1 className='text-xl mb-8'>Add Category:</h1>
			<div className='mb-8'>
				<CategoryForm
					onSubmit={async (data) => {
						// todo make sure data has all fields
						await category.create(data)
						await reload()
					}}
				/>
			</div>
			<hr />

			{isLoading ? (
				<LoadingBox />
			) : (
				<div className='py-8'>
					<CategoryList
						categories={categoriesFromDb || []}
						userId={user.uid}
						reload={reload}
					/>
				</div>
			)}
		</div>
	)
}
