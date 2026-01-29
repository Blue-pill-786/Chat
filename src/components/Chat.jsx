import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Messages from "./Messages";
import Input from "./Input";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";

const Chat = () => {
  const { data } = useContext(ChatContext);

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
