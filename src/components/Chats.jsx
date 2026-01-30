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
        if (snapshot.exists()) {
          setChats(snapshot.data());
        } else {
          setChats({});
        }
      }
    );

    return () => unsub();
  }, [currentUser?.uid]);

  const handleSelect = (userInfo) => {
    if (!userInfo) return;

    dispatch({
      type: "CHANGE_USER",
      payload: {
        user: userInfo,
        currentUid: currentUser.uid,
      },
    });
  };

  const sortedChats = Object.entries(chats)
    .filter(([_, chat]) => chat?.userInfo?.uid)
    .sort(
      (a, b) =>
        (b[1]?.date?.toMillis?.() || 0) -
        (a[1]?.date?.toMillis?.() || 0)
    );

  return (
    <div className="chats">
      {sortedChats.length === 0 && (
        <div className="noChats">No conversations yet</div>
      )}

      {sortedChats.map(([chatId, chat]) => (
        <div
          className="userChat"
          key={chatId}
          onClick={() => handleSelect(chat.userInfo)}
        >
          <img
            src={chat.userInfo.photoURL || "/avatar.png"}
            alt={chat.userInfo.displayName}
          />
          <div className="userChatInfo">
            <span>{chat.userInfo.displayName}</span>
            <p>{chat.lastMessage?.text || "No messages yet"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
