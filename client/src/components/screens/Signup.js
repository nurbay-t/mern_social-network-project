import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    // add regex to username and password also
    const regexpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [url, setUrl] = useState(undefined);
    
    
    const uploadAvatar = () => {
        const data = new FormData();
        data.append("file", avatar);
        data.append("upload_preset", "sn_project");
        data.append("cloud_name", "ryjsefsnhgs");
        fetch("https://api.cloudinary.com/v1_1/ryjsefsnhgs/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
        .then(data => {
            setUrl(data.url);
        })
        .catch(err => {
            console.log();
        });
    }
    
    const postData = () => {
        if (!regexpEmail.test(email)) {
            return M.toast({html: "invalid email", classes: "red darken-1"});
        }
        if (url) {
            uploadAvatar();
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                username,
                email,
                password,
                avatar: url
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({html: data.error, classes: "red darken-1"});
            } else {
                M.toast({html: data.message, classes: "blue darken-1"});
                history.push('/signin');
            }
        })
        .catch(err => {console.log("postData: " + err)});
    }

    return(
        <div className="card-wrapper">
            <div className="card auth-card input-field">
                <h2>SN_Project</h2>
                <input type="text" placeholder="username"
                    value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="text" placeholder="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn blue darken-1">
                        <span>Upload avatar</span>
                        <input type="file" onChange={(e) => setAvatar(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect blue darken-1"
                    onClick={() => postData()}>Sign up</button>
                <h5><Link to="/signin">Already have an account?</Link></h5>
            </div>
        </div>
    );
}

export default Signup;