import { getAuth, signOut } from "firebase/auth";
import type { NextPage } from "next";
import Nav from "../components/Nav";

const Home: NextPage = () => {
  return (
    <div>
      <Nav />
      <button
        onClick={() => {
          signOut(getAuth());
        }}
      >
        logout
      </button>
    </div>
  );
};

export default Home;
