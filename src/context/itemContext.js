import { createContext, useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const itemContext = createContext();
export const useValue = () => useContext(itemContext);

function CustomItemContext({ children }) {
  const [appName] = useState("Social");
  const [registrationError, setRegistrationError] = useState(null);
  const [signInError, setSignInError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError(null);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3]?.files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      let photoURL = null;

      if (file) {
        const storageRef = ref(storage, res.user.uid);
        await uploadBytesResumable(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(res.user, {
        displayName,
        photoURL,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/login");
    } catch (err) {
      setRegistrationError(err.message);
    }
  };

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    setSignInError(null);

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setSignInError(err.message);
    }
  };

  return (
    <itemContext.Provider
      value={{
        appName,
        handleSubmit,
        registrationError,
        handleSubmitSignIn,
        signInError,
      }}
    >
      {children}
    </itemContext.Provider>
  );
}

export default CustomItemContext;
