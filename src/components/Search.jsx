import React, { useContext, useState } from "react";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search =() =>{

    const [username, setUsername] = useState("");
    const [User, setUser] = useState(null);
    const [error, setError] = useState(false);
    const {currentUser} = useContext(AuthContext);

    const handleSearch =async()=>{
        const q = query(
            collection(db, "users"), 
            where("displayName","==", username)
            )
            try{
                const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                setUser({...doc.data(), id: doc.id});
            })
            }catch(error){
                setError(true)
            }
    }
    const handleKey =e=>{
        e.code ==="Enter"&& handleSearch();
    }

    const handleSelect =async()=>{
        //check weather the groups(chats in firestore) exists,if not create new one
        const combinedId = currentUser.uid> User.uid
        ? currentUser.uid +User.uid 
        :User.uid + currentUser.uid
        try {
            const res = await getDoc(doc(db, "chats", combinedId))
            if(!res.exists()){
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId),{messages: []})
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
            
        }

        //create user chat 



        setUser(null);
        setUsername("");
    }

    return(
        <div className="search">
            <div className="searchForm">
                <input type="text" 
                placeholder="Find Your Contacts" 
                onKeyDown={handleKey} 
                onChange={e=>setUsername(e.target.value)}
                value={username}/>
            </div>
            {error&& <span>User Not Found</span>}
            {User && <div className="userChat" onClick={handleSelect}>
                <img src={User.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{User.displayName}</span>
                    
                </div>
            </div>}
        </div>
    )

}

export default Search;