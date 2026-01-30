import { useValue } from "../context/itemContext";
import { Link } from "react-router-dom";
import bleeding from "../img/bleeding.jpg";

const Login = () => {
  const { appName, handleSubmitSignIn, error } = useValue();

  const handleSignIn = (e) => {
    e.preventDefault();
    handleSubmitSignIn(e);
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <img src={bleeding} alt="App icon" className="authLogo" />

        <h1 className="authTitle">{appName}</h1>
        <p className="authSubtitle">Sign in to continue</p>

        <form onSubmit={handleSignIn} className="authForm">
          <input
            type="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit">Sign In</button>

          {error && <span className="authError">{error}</span>}
        </form>

        <p className="authFooter">
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;