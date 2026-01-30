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
        console.log("🔥 userChats snapshot:", snap.data());
        setChats(snap.data() || {});
      }
    );

    return () => unsub();
  }, [currentUser?.uid]);

  const chatEntries = Object.entries(chats);

  console.log("✅ Chat Entries:", chatEntries);

  return (
    <div className="chats">
      {chatEntries.length === 0 && (
        <div className="noChats">No conversations yet</div>
      )}

      {chatEntries.map(([chatId, chat]) => {
        if (!chat?.userInfo?.uid) return null;

        return (
          <div
            className="userChat"
            key={chatId}
            onClick={() =>
              dispatch({
                type: "CHANGE_USER",
                payload: {
                  user: chat.userInfo,
                  currentUid: currentUser.uid,
                },
              })
            }
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
        );
      })}
    </div>
  );
};

export default Chats;
