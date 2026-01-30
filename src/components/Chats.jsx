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
      (snap) => {
        setChats(snap.exists() ? snap.data() : {});
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

  const chatEntries = Object.entries(chats).sort(
    (a, b) =>
      (b[1]?.date?.toMillis?.() || 0) -
      (a[1]?.date?.toMillis?.() || 0)
  );
  console.log("Chat Entries:", chatEntries);
  return (
    <div className="chats">
      {chatEntries.length === 0 && (
        <div className="noChats">No conversations yet</div>
      )}

      {chatEntries.map(([chatId, chat]) => {
        const userInfo = chat?.userInfo;

        // 🔒 HARD GUARD — prevents crash
        if (!userInfo?.uid) return null;

        return (
          <div
            className="userChat"
            key={chatId}
            onClick={() => handleSelect(userInfo)}
          >
            <img
              src={userInfo.photoURL || "/avatar.png"}
              alt={userInfo.displayName || "User"}
            />

            <div className="userChatInfo">
              <span>{userInfo.displayName || "Unknown"}</span>
              <p>{chat.lastMessage?.text || "No messages yet"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
