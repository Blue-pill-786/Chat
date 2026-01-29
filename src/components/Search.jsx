import React, { useContext, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username.trim())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No user found");
        return;
      }

      querySnapshot.forEach((docSnap) => {
        if (docSnap.id !== currentUser.uid) {
          setUser({ ...docSnap.data(), uid: docSnap.id });
        } else {
          setError("You can’t chat with yourself 🙂");
        }
      });
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSelect = async () => {
    if (!user) return;

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
          updateDoc(doc(db, "userChats", currentUser.uid), {
            [`${combinedId}.userInfo`]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [`${combinedId}.date`]: serverTimestamp(),
          }),
          updateDoc(doc(db, "userChats", user.uid), {
            [`${combinedId}.userInfo`]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [`${combinedId}.date`]: serverTimestamp(),
          }),
        ]);
      }
    } catch (err) {
      console.error(err);
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
          onKeyDown={handleKeyDown}
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
            <img src={user.photoURL} alt={user.displayName} />
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
