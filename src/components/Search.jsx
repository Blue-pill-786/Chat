import React, { useContext, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    if (!username.trim() || !currentUser?.uid) return;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username.trim())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("No user found");
        return;
      }

      const match = snapshot.docs.find(
        (docSnap) => docSnap.id !== currentUser.uid
      );

      if (!match) {
        setError("You can’t chat with yourself 🙂");
        return;
      }

      setUser({ ...match.data(), uid: match.id });
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async () => {
    if (!user || !currentUser?.uid) return;

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const chatRef = doc(db, "chats", combinedId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, { messages: [] });

        await Promise.all([
          setDoc(
            doc(db, "userChats", currentUser.uid),
            {
              [`${combinedId}.userInfo`]: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              [`${combinedId}.date`]: serverTimestamp(),
            },
            { merge: true }
          ),
          setDoc(
            doc(db, "userChats", user.uid),
            {
              [`${combinedId}.userInfo`]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              [`${combinedId}.date`]: serverTimestamp(),
            },
            { merge: true }
          ),
        ]);
      }

      // ✅ OPEN THE CHAT IMMEDIATELY
      dispatch({
        type: "CHANGE_USER",
        payload: {
          user,
          currentUid: currentUser.uid,
        },
      });
    } catch (err) {
      setError("Failed to start chat");
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search users…"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      {loading && <span className="searchHint">Searching…</span>}
      {error && <span className="searchError">{error}</span>}

      <AnimatePresence>
        {user && (
          <motion.div
            className="userChat"
            onClick={handleSelect}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <img
              src={user.photoURL || "/avatar.png"}
              alt={user.displayName}
            />
            <div className="userChatInfo">
              <span>{user.displayName}</span>
              <p>Click to start chat</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
