import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Profile = () => {

    const [myPosts, setMyPosts] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        fetch("/myposts", {
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("jwt"),
            }
        })
        .then(res => res.json())
        .then(res => {
            setMyPosts(res.myposts)
        });
    }, []);

    useEffect(() => {
        if (url) {
            fetch("/updateavatar", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    avatar: url
                })
            })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    M.toast({html: res.error, classes: "red darken-1"});
                } else {
                    M.toast({html: "An avatar was changed", classes: "blue darken-1"});
                    localStorage.setItem("user", JSON.stringify({...state, avatar: url}));
                    dispatch({type: "UPDATEAVATAR", payload: url});
                }
            })
            .catch(err => {console.log("postData: " + err)});
        }
    }, [url]);

    const updateAvatar = (file) => {
        const data = new FormData();
        data.append("file", file);
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
            console.log("hey error!");
        });
    }

    return(
        <>
        {state?
        <div className="profile-wrapper">
            <div className="profile">
                <div>
                    <img className="profile-image" alt="profile" src={state.avatar}>  
                    </img>
                </div>
                <div className="profile-info">
                    <h4>{state?state.username:"loading"}</h4>
                    <div className="profile-numbers">
                        <h6>{myPosts.length} posts</h6>
                        <h6>{state?state.followers.length:""} followers</h6>
                        <h6>{state?state.following.length:""} following</h6>
                    </div>
                    <div className="file-field input-field">
                        <div className="btn blue darken-1">
                            <span>Image</span>
                            <input type="file" onChange={(e) => updateAvatar(e.target.files[0])}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                myPosts.map(post => {
                    return(
                    <img className="gallery-item" alt={post.title} src={post.photo} key={post._id}/>
                    );
                })
                }
            </div>
        </div>
        :<h1 style={{textAlign: 'center'}}>LOADING</h1> 
        }
        </>
    );
}

export default Profile;