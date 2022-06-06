import { ReactElement, useContext } from "react";
import LoadingBox from "../components/common/LoadingBox";
import Nav from "../components/common/Nav";
import WeekDoughnutTiles from "../components/dashboard/WeekDoughnutTiles";
import { UserContext, UserProvider } from "../components/UserContext";

export default function Dashboard() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <LoadingBox />;
  }

  return (
    <>
      <Nav />
      <WeekDoughnutTiles userId={user.uid} />
    </>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserProvider>{page}</UserProvider>;
};
