const handleSend = async () => {
  if (!data.chatId || !currentUser?.uid) return;
  if (!text.trim() && !img) return;

  let downloadURL = null;

  try {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      const snapshot = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          reject,
          () => resolve(uploadTask.snapshot)
        );
      });

      downloadURL = await getDownloadURL(snapshot.ref);
    }

    const message = {
      id: uuid(),
      text: text.trim(),
      senderId: currentUser.uid,
      date: Timestamp.now(),
      ...(downloadURL && { img: downloadURL }),
    };

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion(message),
    });

    const lastMessageText = text.trim() || "📷 Image";

    await Promise.all([
      updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${data.chatId}.lastMessage`]: { text: lastMessageText },
        [`${data.chatId}.date`]: serverTimestamp(),
      }),
      updateDoc(doc(db, "userChats", data.user.uid), {
        [`${data.chatId}.lastMessage`]: { text: lastMessageText },
        [`${data.chatId}.date`]: serverTimestamp(),
      }),
    ]);

    setText("");
    setImg(null);
  } catch (err) {
    console.error("Message send failed:", err);
  }
};
