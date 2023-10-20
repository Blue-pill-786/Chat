import React from "react";
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import Conversation from "./Conversation";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search/>
      <Chats/>
      {/* <Conversation/> */}
    </div>
  );
};

export default Sidebar;
