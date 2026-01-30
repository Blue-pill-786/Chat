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
        console.log("🔥 userChats snapshot:", {
          exists: snapshot.exists(),
          uid: currentUser.uid,
          data: snapshot.data(),
        });

        setChats(snapshot.data() || {});
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

  const validChats = Object.entries(chats || {})
    .filter(
      ([, chat]) =>
        chat &&
        chat.userInfo &&
        chat.userInfo.uid
    )
    .sort(
      (a, b) =>
        (b[1]?.date?.toMillis?.() || 0) -
        (a[1]?.date?.toMillis?.() || 0)
    );

  return (
    <div className="chats">
      

      {validChats.map(([chatId, chat]) => (
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
