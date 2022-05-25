import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import Nav from "../components/Nav";
import { UserContext, UserProvider } from "../components/UserContext";

export default function Timetracker() {
  return (
    <div>
      <Nav />
      <div>User</div>
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
