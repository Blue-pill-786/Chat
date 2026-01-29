
import { useValue } from "../context/itemContext";
import { Link } from "react-router-dom";
import bleeding  from '../img/bleeding.jpg'
const Login =() =>{
    
    const { appName, handleSubmitSignIn, error } = useValue();

    const handleSignIn = async (e) => {
      e.preventDefault();
      handleSubmitSignIn(e);
    };
    return(
        <div className="formContainer">
            <div className="formWrapper">
                <img src={bleeding} alt="" />
                <span className="logo">{appName}</span>
                <span className="title">Login</span>
                
                <form onSubmit={handleSignIn}>

                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="password" />
                    
                   
                    <button>Sign In</button>
                </form>
                {error && <span>{error}</span>}
                <p>Don't have an account? <Link to="/register">Register</Link></p>

            </div>
             </div>
    )
}

export default Login;