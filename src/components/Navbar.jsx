import React, { useContext } from "react";
import { useValue } from "../context/itemContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import bleeding from "../img/bleeding.jpg";

const NavBar = () => {
  const { appName } = useValue();
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="navbar">
      <img src={bleeding} alt="App logo" />
      <span className="logo">{appName}</span>

      {currentUser && (
        <div className="user">
          <img
            src={currentUser.photoURL || "/avatar.png"}
            alt="User avatar"
          />
          <span>{currentUser.displayName || "User"}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
