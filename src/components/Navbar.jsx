import React, { useContext } from "react";
import { useValue } from "../context/itemContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import bleeding  from '../img/bleeding.jpg'

const NavBar =() =>{
    const {appName} = useValue();
    const {currentUser} = useContext(AuthContext)
    return(
        <div className="navbar">
            <img src={bleeding} alt=""/>
            <span className="logo">{appName}</span>
            <div className="user">
                <img src={currentUser.photoURL} alt="" />
                <span>{currentUser.displayName}</span>
                <button onClick={()=>signOut(auth)}>Logout</button>
            </div>
        </div>
    )

}

export default NavBar;