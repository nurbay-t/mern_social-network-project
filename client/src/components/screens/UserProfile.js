import React, {useEffect, useState, useContext} from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'


const Profile = () => {

    const [userProfile, setUserProfile] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const {id} = useParams();

    useEffect(() => {
        fetch(`/user/${id}`, {
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(res => {
            setUserProfile(res);
        });
    }, []);

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: id
            })
        })
        .then(res => res.json())
        .then(res => {
            dispatch({type: "UPDATE", payload: {followers: res.followers, following: res.following}});
            localStorage.setItem("user", JSON.stringify(res));
            setUserProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, res._id]
                    }
                }
            })
        });
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: id
            })
        })
        .then(res => res.json())
        .then(res => {
            dispatch({type: "UPDATE", payload: {followers: res.followers, following: res.following}});
            localStorage.setItem("user", JSON.stringify(res));
            setUserProfile((prevState) => {
                const updFollowers = prevState.user.followers.filter(item => item != res._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: updFollowers
                    }
                }
            })
        });
    }

    return(
        <>
        {
            userProfile? 
            <div className="profile-wrapper">
                <div className="profile">
                    <div>
                        <img className="profile-image" alt="profile" src={userProfile.user.avatar}>  
                        </img>
                    </div>
                    <div className="profile-info">
                        <h4>{userProfile.user.username}</h4>
                        <div className="profile-numbers">
                            <h6>{userProfile.posts.length} posts</h6>
                            <h6>{userProfile.user.followers.length} followers</h6>
                            <h6>{userProfile.user.following.length} following</h6>
                        </div>
                        {userProfile.user.followers.includes(state._id)
                        ?<button className="btn waves-effect white" style={{color: 'black'}}
                            onClick={() => unfollowUser()}>Unfollow</button>
                        :<button className="btn waves-effect blue darken-1"
                        onClick={() => followUser()}>Follow</button>}
                    </div>
                </div>

                <div className="gallery">
                    {
                    userProfile.posts.map(post => {
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