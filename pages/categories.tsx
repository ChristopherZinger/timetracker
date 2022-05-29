import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import Categories from "../components/categories/Categories";
import LoadingBox from "../components/common/LoadingBox";
import Nav from "../components/common/Nav";
import { UserContext, UserProvider } from "../components/UserContext";
import { AppError } from "../utils/appError";

export default function CategoriesPage() {
  const { user } = useContext(UserContext);
  const { push } = useRouter();
  if (user === null) {
    push("/");
    return;
  }

  if (user === undefined) {
    throw new AppError("user_can_not_be_loading_at_this_point");
  }

  return <Categories user={user} />;
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProvider>
      <UserContext.Consumer>
        {({ user }) => (
          <>
            <Nav />
            {user === undefined ? <LoadingBox /> : <>{page}</>}
          </>
        )}
      </UserContext.Consumer>
    </UserProvider>
  );
};
