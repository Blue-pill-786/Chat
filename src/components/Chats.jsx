import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState({});

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(
      doc(db, "userChats", currentUser.uid),
      (snapshot) => {
        setChats(snapshot.data() || {});
      }
    );

    return () => unsub();
  }, [currentUser?.uid]);

  const handleSelect = (userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        .sort(
          (a, b) =>
            b[1]?.date?.toMillis() - a[1]?.date?.toMillis()
        )
        .map(([chatId, chat]) => (
          <div
            className="userChat"
            key={chatId}
            onClick={() => handleSelect(chat.userInfo)}
          >
            <img
              src={chat.userInfo?.photoURL || "/avatar.png"}
              alt="user avatar"
            />
            <div className="userChatInfo">
              <span>{chat.userInfo?.displayName}</span>
              <p>{chat.lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
