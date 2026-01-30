import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 🔑 Reset when no chat is selected
    if (!data.chatId) {
      setMessages([]);
      return;
    }

    const chatRef = doc(db, "chats", data.chatId);

    const unsub = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        setMessages(chatData.messages || []);
      } else {
        // chat not created yet
        setMessages([]);
      }
    });

    return () => unsub();
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.length === 0 && (
        <div className="noMessages">
          No messages yet. Say hello 👋
        </div>
      )}

      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
    </div>
  );
};

export default Messages;
