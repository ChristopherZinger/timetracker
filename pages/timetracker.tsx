import { ReactElement, useContext, useEffect, useState } from "react";
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
  return <UserProvider>{page}</UserProvider>;
};
