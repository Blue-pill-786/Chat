import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Messages from "./Messages";
import Input from "./Input";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import useOnlineStatus from "../hooks/useOnlineStatus";


const Chat = () => {
    const { data } = useContext(ChatContext);
    const isOnline = useOnlineStatus();

  if (!data.chatId) {
    return (
      <div className="chat empty">
        <span className="noChatText">
          Select a conversation to start chatting
        </span>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chatInfo">
        {!isOnline && (
  <span style={{ fontSize: "12px", color: "#ef4444" }}>
    Offline
  </span>
)}
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="Video call" />
          <img src={Add} alt="Add user" />
          <img src={More} alt="More options" />
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
