import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect, useState } from "react";
import useGetActiveCategories from "../components/apiHooks/getActiveCategories";
import useGetTodaysTrackers from "../components/apiHooks/getTodaysTrackers";
import LoadingBox from "../components/common/LoadingBox";
import Nav from "../components/common/Nav";
import { useTick } from "../components/hooks/Tick";
import TimetrackerList from "../components/timer/TimetrackerList";
import TimetrackerForm from "../components/timer/TimetrackerForm";
import { UserContext, UserProvider } from "../components/UserContext";
import {
  TTracker,
  TTrackerInput,
  Timetracker,
} from "../types/domains/Timetracker";
import { TimeUtils } from "../types/utils/time";
import { maxBy } from "lodash";
import { AppError } from "../utils/appError";

export default function TimetrackerPage() {
  const [trackers, setTrackers] = useState<undefined | TTracker[]>(undefined);
  const [now, setNow] = useState<number>(new Date().getTime());
  const [start, setStart] = useState<number | undefined>(undefined);
  const { user } = useContext(UserContext);
  const tick = useTick();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetActiveCategories();
  const { data: todaysTrackers, isLoading: isLoadingTrackers } =
    useGetTodaysTrackers();

  useEffect(() => {
    if (todaysTrackers) {
      if (todaysTrackers.length) {
        setTrackers(todaysTrackers);
        setStart(maxBy(todaysTrackers, "end")?.end);
      } else {
        setTrackers([]);
        setStart(new Date().getTime());
      }
    }
  }, [todaysTrackers]);

  useEffect(() => {
    setNow(tick);
  }, [tick]);

  const handleStartDay = () => {
    setStart(new Date().getTime());
  };

  const onSubmitNewItem = async (item: TTrackerInput) => {
    if (!user) {
      throw new AppError("user_required_to_create_tracker");
    }
    const timetracker = new Timetracker(user.uid);
    const tracker = await timetracker.create(item);
    setStart(item.end);
    const list = [...(trackers || []), tracker];
    setTrackers(list);
  };

  if (isLoadingCategories || isLoadingTrackers) {
    return <div>loading data</div>;
  }

  return (
    <div>
      <Nav />
      <section>
        {trackers?.length && categories ? (
          <TimetrackerList list={trackers} categories={categories} />
        ) : null}
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

TimetrackerPage.getLayout = function getLayout(page: ReactElement) {
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
