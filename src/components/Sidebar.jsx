import React, { useContext } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <div className="sidebar empty">
        <span className="sidebarHint">
          Loading chats…
        </span>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
