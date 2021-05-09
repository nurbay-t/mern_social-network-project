import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

import {UserContext} from '../../App'

const Signin = () => {
    // add regex to username and password also
    const regexpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    // const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const postData = () => {
        if (!regexpEmail.test(email)) {
            return M.toast({html: "invalid email", classes: "red darken-1"});
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({html: data.error, classes: "red darken-1"});
            } else {
                localStorage.setItem("jwt", data.token);
                console.log(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({type: "USER", payload: data.user});
                M.toast({html: "Signed in", classes: "blue darken-1"});
                history.push('/');
            }
        })
        .catch(err => {console.log("postData: " + err)});
    }

    return(
        <div className="card-wrapper">
            <div className="card auth-card input-field">
                <h2>SN_Project</h2>
                <input type="text" placeholder="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="btn waves-effect blue darken-1"
                    onClick={() => postData()}>Login</button>
                <h5><Link to="/signup">Don't have an account?</Link></h5>
            </div>
        </div>
    );
}

export default Signin;