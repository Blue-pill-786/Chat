import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";

import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const CreateConversation = ({ data }) => {
  const [contacts, setContacts] = useState([]);
   const { dispatch } = useContext(ChatContext);
  const [showContacts, setShowContacts] = useState(false)
  const {currentUser} = useContext(AuthContext);
  const [User, setUser] = useState(null);
  const [username, setUsername] = useState(null)
  useEffect(() => {
    const fetchContacts = async () => {
      const q = query(
        collection(db, "users"), 
       
        )
  
        const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc)=>{
                  setUser({...doc.data(), id: doc.id})})
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const contactsData = [];
        querySnapshot.forEach((doc) => {
           
                
                contactsData.push(doc.data());
            
         
        });
        setContacts(contactsData);
        
       
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };

    fetchContacts();
  }, [data]);

  const handleSelect =async(User)=>{
    //check weather the groups(chats in firestore) exists,if not create new one
    const combinedId = currentUser.uid> User.uid
    ? currentUser.uid +User.uid 
    :User.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, "chats", combinedId))
      if(res.exists()){
         
            //create a chat in chats collection
            await setDoc(doc(db, "chats", combinedId),{messages: []})
            dispatch({ type: "CHANGE_USER", payload: User });
            //create user chats
            await updateDoc(doc(db, "userChats", currentUser.uid),{
                [combinedId+".userInfo"]:{
                    uid:User.uid,
                    displayName:User.displayName,
                    photoURL:User.photoURL
                },
                [combinedId+".date"]:serverTimestamp(),
            });
           
            await updateDoc(doc(db, "userChats", User.uid),{
              
                [combinedId+".userInfo"]:{
                  
                    uid:currentUser.uid,
                    displayName:currentUser.displayName,
                    photoURL:currentUser.photoURL
                },
                [combinedId+".date"]:serverTimestamp(),
            });

        }
        

    } catch (error) {
        if(User.uid===null){
          console.log("uid is null")
          
        }
    }

    //create user chat 
   



    setUser(null);
    setUsername("");
}


  // const handleSelect = (u) => {
  //   dispatch({ type: "CHANGE_USER", payload: u });
  // };

  const handleContacts =()=>{
    setShowContacts(!showContacts)
  }

  return (
    
    <div className="contactscontainer">
      <button  className="newbutton" onClick={handleContacts}>Create New Conversation</button>
      {showContacts && <div className="contactsWrapper">
        
        <ul className="contactsWrap">
          {contacts.map((contact, index) => (
            <h2
              key={index}
              className="contacts"
              onClick={() => handleSelect(contact)}
            >
                {<img  src={contact.photoURL} alt="contactimg"/>}
              {contact.displayName}
            </h2>
          ))}
        </ul>
      </div>}
      
    </div>
  );
};

export default CreateConversation;
