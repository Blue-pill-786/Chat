import React from "react";
import Add from "../img/addAvatar.png"
import { useValue } from "../context/itemContext";
import { Link } from "react-router-dom";
import bleeding  from '../img/bleeding.jpg'



const Register =() =>{
    
    const {appName, handleSubmit, error} = useValue();

   

    return(
        <div className="formContainer">
            <div className="formWrapper">
                <img src={bleeding} alt="" />
                <span className="logo">{appName}</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Display name"/>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="password" />
                    <input style={{display:"none"}}type="file" id="file"/>
                    <label htmlFor="file">
                    <img src={Add} alt="" />
                    <span> Add an avatar </span>
                    </label>
                    <button>Sign Up</button>
                    {error && <span>Something went wrong</span>}
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>

            </div>
        </div>
    )
}

export default Register;