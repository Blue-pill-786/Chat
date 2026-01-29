import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef(null);

  const isOwner = message.senderId === currentUser.uid;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const avatar = isOwner
    ? currentUser.photoURL
    : data.user?.photoURL;

  const time =
    message?.date?.toDate
      ? format(message.date.toDate(), "p")
      : "";

  return (
    <div ref={ref} className={`message ${isOwner ? "owner" : ""}`}>
      {!isOwner && (
        <div className="messageInfo">
          <img src={avatar || "/avatar.png"} alt="avatar" />
        </div>
      )}

      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="sent media" />}
        <span className="timestamp">{time}</span>
      </div>
    </div>
  );
};

export default Message;
