import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [sending, setSending] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!data.chatId || !data.user?.uid || !currentUser?.uid) return;
    if (!text.trim() && !img) return;
    if (sending) return;

    setSending(true);

    try {
      let downloadURL = null;

      /* =========================
         UPLOAD IMAGE (IF ANY)
      ========================= */
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        const snapshot = await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, () =>
            resolve(uploadTask.snapshot)
          );
        });

        downloadURL = await getDownloadURL(snapshot.ref);
      }

      /* =========================
         MESSAGE OBJECT
      ========================= */
      const message = {
        id: uuid(),
        text: text.trim(),
        senderId: currentUser.uid,
        date: Timestamp.now(),
        ...(downloadURL && { img: downloadURL }),
      };

      /* =========================
         WRITE MESSAGE (SAFE)
      ========================= */
      await setDoc(
        doc(db, "chats", data.chatId),
        { messages: arrayUnion(message) },
        { merge: true }
      );

      const lastMessageText = text.trim() || "📷 Image";

      /* =========================
         UPDATE USER CHATS (SAFE)
      ========================= */
      await Promise.all([
        setDoc(
          doc(db, "userChats", currentUser.uid),
          {
            [`${data.chatId}.lastMessage`]: { text: lastMessageText },
            [`${data.chatId}.date`]: serverTimestamp(),
          },
          { merge: true }
        ),
        setDoc(
          doc(db, "userChats", data.user.uid),
          {
            [`${data.chatId}.lastMessage`]: { text: lastMessageText },
            [`${data.chatId}.date`]: serverTimestamp(),
          },
          { merge: true }
        ),
      ]);

      setText("");
      setImg(null);
    } catch (err) {
      console.error("Message send failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={sending}
      />

      <div className="send">
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="Attach" />
        </label>

        <button onClick={handleSend} disabled={!data.chatId || sending}>
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Input;
