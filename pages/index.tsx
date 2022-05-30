import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import LoadingBox from "../components/common/LoadingBox";
import Nav from "../components/common/Nav";
import { UserContext, UserProvider } from "../components/UserContext";

export default function Home() {
  const { user } = useContext(UserContext);
  const { push } = useRouter();

  if (user) {
    push("/timetracker");
    return;
  }

  if (user === null) {
    push("/login");
    return;
  }

  if (user === undefined) {
    return <LoadingBox />;
  }

  return <div>Woops, something went wrong</div>;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <UserProvider>{page}</UserProvider>;
};
