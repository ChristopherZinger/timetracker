import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import LoadingBox from "../components/common/LoadingBox";
import Nav from "../components/common/Nav";
import { UserContext, UserProvider } from "../components/UserContext";
import { Category } from "../types/domains/Category";

export default function Categories() {
  const { user } = useContext(UserContext);
  return (
    user && (
      <>
        <Nav />
        <CategoryForm
          userId={user.uid}
          onSubmit={async (userId, data) => {
            const category = new Category(userId);
            // todo make sure data has all fields
            await category.create(data);
          }}
        />
        <CategoryList userId={user.uid} />
      </>
    )
  );
}

Categories.getLayout = function getLayout(page: ReactElement) {
  const { push } = useRouter();
  return (
    <UserProvider>
      <UserContext.Consumer>
        {({ user }) => {
          user === null && push("/");
          return user ? <>{page}</> : <LoadingBox />;
        }}
      </UserContext.Consumer>
    </UserProvider>
  );
};
