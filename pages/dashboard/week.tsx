import { isNull } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useContext, useState } from "react";
import LoadingBox from "../../components/common/LoadingBox";
import Nav from "../../components/common/Nav";
import WeekSelector from "../../components/dashboard/week/WeekSelector";
import WeekDoughnutTiles from "../../components/dashboard/WeekDoughnutTiles";
import { UserContext, UserProvider } from "../../components/UserContext";
import { BASE_URL } from "../../types/baseUrls";

export default function Week() {
  const { user } = useContext(UserContext);
  const { push } = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (user === undefined) {
    return <LoadingBox />;
  }

  if (isNull(user)) {
    push(BASE_URL.login);
    return;
  }

  return (
    <div>
      <div className="px-10 pt-10">
        <WeekSelector
          selectedDate={selectedDate}
          onWeekChange={(d) => setSelectedDate(d)}
        />
      </div>
      <WeekDoughnutTiles userId={user.uid} date={selectedDate} />
    </div>
  );
}

Week.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProvider>
      <Nav />
      {page}
    </UserProvider>
  );
};
