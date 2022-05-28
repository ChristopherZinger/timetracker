import dayjs from "dayjs";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import useGetActiveCategories from "../components/apiHooks/getActiveCategories";
import useGetTodaysTrackers from "../components/apiHooks/getTodaysTrackers";
import LoadingBox from "../components/LoadingBox";
import Nav from "../components/Nav";
import { useTick } from "../components/timer/Tick";
import TimetrackerList from "../components/timer/TimetrackerList";
import TimetrackerForm from "../components/TimetrackerForm";
import { UserContext, UserProvider } from "../components/UserContext";
import { TTracker, TTrackerInput } from "../types/domains/Timetracker";
import { TimeUtils } from "../types/utils/time";
import { maxBy } from "lodash";

export default function Timetracker() {
  const [trackers, setTrackers] = useState<undefined | TTracker[]>(undefined);
  const [now, setNow] = useState<number>(new Date().getTime());
  const [start, setStart] = useState<number | undefined>(undefined);
  const tick = useTick();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetActiveCategories();
  const { data: todaysTrackers, isLoading: isLoadingTrackers } =
    useGetTodaysTrackers();

  useEffect(() => {
    if (!todaysTrackers) {
      return;
    }
    if (todaysTrackers.length) {
      setTrackers(todaysTrackers);
      setStart(maxBy(todaysTrackers, "end")?.end);
    } else {
      setTrackers([]);
      setStart(new Date().getTime());
    }
  }, [todaysTrackers]);

  useEffect(() => {
    setNow(tick);
  }, [tick]);

  const handleStartDay = () => {
    setStart(new Date().getTime());
  };

  const onSubmitNewItem = (item: TTrackerInput) => {
    const id = Math.floor(Math.random() * 1000).toString();
    const tracker = { id, ...item };
    const list = [...(trackers || []), tracker];
    setStart(item.end);
    setTrackers(list);
  };

  if (isLoadingCategories || isLoadingTrackers) {
    return <div>loading data</div>;
  }

  return (
    <div>
      <Nav />
      <section>
        {trackers?.length && categories && (
          <TimetrackerList list={trackers} categories={categories} />
        )}
      </section>

      <section>
        {start && categories && trackers ? (
          <TimetrackerForm
            start={start}
            onSubmit={onSubmitNewItem}
            categories={categories}
          />
        ) : (
          <div>
            <button onClick={handleStartDay}>Start Day</button>
            <span>at: </span>{" "}
            <span>{TimeUtils.timestampToHourMinute(now)}</span>
          </div>
        )}
      </section>
    </div>
  );
}

Timetracker.getLayout = function getLayout(page: ReactElement) {
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
