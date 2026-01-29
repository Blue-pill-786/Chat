import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) {
      setMessages([]);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "chats", data.chatId),
      (snapshot) => {
        if (snapshot.exists()) {
          setMessages(snapshot.data().messages || []);
        } else {
          setMessages([]);
        }
      }
    );

    return () => unsub();
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  );
};

export default Messages;
