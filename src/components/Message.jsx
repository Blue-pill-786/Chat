import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formattedDate =
    message?.date?.toDate
      ? format(message.date.toDate(), "Pp")
      : "";

  const isOwner = message.senderId === currentUser.uid;

  const avatar = isOwner
    ? currentUser.photoURL
    : data.user?.photoURL;

  return (
    <div
      ref={ref}
      className={`message ${isOwner ? "owner" : ""}`}
    >
      <div className="messageInfo">
        <img
          src={avatar || "/avatar.png"}
          alt="user avatar"
        />
        <span className="formattedDate">
          {formattedDate}
        </span>
      </div>

      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="sent media" />}
      </div>
    </div>
  );
};

export default Message;
