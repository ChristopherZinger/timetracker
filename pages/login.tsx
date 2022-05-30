import { FormEvent, ReactElement, useContext, useState } from "react";
import Nav from "../components/common/Nav";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext, UserProvider } from "../components/UserContext";
import { useRouter } from "next/router";
import LoadingBox from "../components/common/LoadingBox";

export default function Login() {
  const { push } = useRouter();
  const { user } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  if (user !== null) {
    push("/timetracker");
    return;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <div>
      <Nav />
      <div className="w-96 mx-auto shadow p-8 mt-20 rounded-md ">
        <h1 className="text-xl mb-10">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col border-b-2 border-black mb-10">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={({ target }) => setEmail(target.value)}
              value={email}
            />
          </div>

          <div className="flex flex-col border-b-2 border-black">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
          </div>

          <div className="flex flex-row-reverse mt-10">
            <button type="submit" className="px-4 py-2 rounded shadow">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProvider>
      <UserContext.Consumer>
        {({ user }) => {
          return user === undefined ? <LoadingBox /> : <>{page}</>;
        }}
      </UserContext.Consumer>
    </UserProvider>
  );
};
