import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import LoadingBox from "../components/common/LoadingBox";
import Nav from "../components/common/Nav";
import Timetracker from "../components/timer/Timetracker";
import { UserContext, UserProvider } from "../components/UserContext";
import { AppError } from "../utils/appError";
export default function TimetrackerPage() {
  const { push } = useRouter();
  const { user } = useContext(UserContext);

  if (user === null) {
    push("/");
    return;
  }

  if (user === undefined) {
    throw new AppError("user_can_not_be_loading_at_this_point");
  }

  return <Timetracker user={user} />;
}

TimetrackerPage.getLayout = function getLayout(page: ReactElement) {
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
