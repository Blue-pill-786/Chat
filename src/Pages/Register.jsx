import React from "react";
import { Link } from "react-router-dom";
import { useValue } from "../context/itemContext";
import Add from "../img/addAvatar.png";
import bleeding from "../img/bleeding.jpg";

const Register = () => {
  const { appName, handleSubmit, registrationError } = useValue();

  return (
    <div className="authPage">
      <div className="authCard">
        <img src={bleeding} alt="App logo" className="authLogo" />

        <h1 className="authTitle">{appName}</h1>
        <p className="authSubtitle">Create your account</p>

        <form className="authForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Display name"
            required
          />
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

          <input
            type="file"
            id="avatar"
            hidden
          />

          <label htmlFor="avatar" className="avatarUpload">
            <img src={Add} alt="Add avatar" />
            <span>Add an avatar</span>
          </label>

          <button type="submit">Sign Up</button>

          {registrationError && (
            <div className="authError">{registrationError}</div>
          )}
        </form>

        <div className="authFooter">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
