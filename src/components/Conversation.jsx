import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";

import { ChatContext } from "../context/ChatContext";

const CreateConversation = ({ data }) => {
  const [contacts, setContacts] = useState([]);
   const { dispatch } = useContext(ChatContext);
  const [showContacts, setShowContacts] = useState(false)

  useEffect(() => {
    const fetchContacts = async () => {
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

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

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
