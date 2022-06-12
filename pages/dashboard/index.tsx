import Link from "next/link";
import { ReactElement, useContext } from "react";
import LoadingBox from "../../components/common/LoadingBox";
import Nav from "../../components/common/Nav";
import { UserContext, UserProvider } from "../../components/UserContext";
import { BASE_URL } from "../../types/baseUrls";

export default function Dashboard() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <LoadingBox />;
  }

  return (
    <div className="p-10">
      <ul>
        <li>
          <Link href={`${BASE_URL.dashboard}/week`}>week</Link>
        </li>
      </ul>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProvider>
      <Nav />
      {page}
    </UserProvider>
  );
};
