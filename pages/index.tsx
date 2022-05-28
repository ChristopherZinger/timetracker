import { getAuth, signOut } from "firebase/auth";
import { ReactElement } from "react";
import Nav from "../components/Nav";
import { UserProvider } from "../components/UserContext";

export default function Home() {
  return (
    <div>
      <Nav />
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <UserProvider>{page}</UserProvider>;
};