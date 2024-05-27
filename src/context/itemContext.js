import { createContext, useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const itemContext = createContext();

function useValue() {
  const value = useContext(itemContext);
  return value;
}

function CustomItemContext({ children }) {
  const [appName] = useState("Social");
  const [registrationError, setRegistrationError] = useState(false);
  const [signInError, setSignInError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3]?.files[0];
  
    if (!email || !password) {
      setRegistrationError("Email and password are required");
      return;
    }
  
    console.log("Creating user with email:", email, "and password:", password);
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", res.user);
  
      if (file) {
        const storageRef = ref(storage, `${res.user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error("Upload failed:", error);
            setRegistrationError("Upload failed: " + error.message);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File uploaded, download URL:", downloadURL);
            try {
              const update = await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });
              console.log("update issue",update);
            } catch (error) {
              // Handle any errors that occur during profile update
              console.error("Error updating profile:", error);
            }
           const setdoc =  await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            console.log("users",setdoc)
            const set = await setDoc(doc(db, "userChats", res.user.uid), {});
            console.log("userchats",set)
            navigate("/login");
          }
        );
      } else {
        await updateProfile(res.user, { displayName });
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: null,
        });
        await setDoc(doc(db, "userChats", res.user.uid), {});
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setRegistrationError("Registration failed: " + error.message);
    }
  };
  

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setSignInError("Login failed: " + error.message);
    }
  };

  return (
    <itemContext.Provider
      value={{ appName, handleSubmit, registrationError, handleSubmitSignIn, signInError }}
    >
      {children}
    </itemContext.Provider>
  );
}

export { itemContext, useValue };
export default CustomItemContext;
