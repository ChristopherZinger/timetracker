import { FormEvent, useState } from "react";
import Nav from "../components/Nav";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <div>
      <Nav />
      <h1>login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={({ target }) => setEmail(target.value)}
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
          />
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
