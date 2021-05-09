import React, {useState, useEffect, UseContext, useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'


const Home = () => {
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);

    useEffect(() => {
        fetch('/followingpost', {headers:{
            "Authorization": "Bearer "+localStorage.getItem("jwt"),
        }})
        .then(res => res.json())
        .then(res => {
            setData(res.posts);
        })
    }, []);

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(res => {
            const newData = data.map(post => {
                if (post._id == res._id) {
                    return res;
                } else {
                    return post;
                }
            });
            setData(newData);
        })
    }

    const dislikePost = (id) => {
        fetch('/dislike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(res => {
            const newData = data.map(post => {
                if (post._id == res._id) {
                    return res;
                } else {
                    return post;
                }
            });
            setData(newData);
        })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(res => {
            const newData = data.map(post => {
                if (post._id == res._id) {
                    return res;
                } else {
                    return post;
                }
            });
            setData(newData);
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
            }
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            const newData = data.filter(item => {
                return item._id != postId
            })
            setData(newData);
        })
    } 

    return(
        <div className="home">
            {
                data.map(post => {
                    return(
                    <div className="card home-card" key={post._id}>
                        <h5>
                            <Link to={post.postedBy._id == state._id?'/profile':'/profile/'+post.postedBy._id}>{post.postedBy.username}</Link>
                            {post.postedBy._id == state._id 
                            && <i className="material-icons" style={{float: "right"}} onClick={() => deletePost(post._id)}>delete</i>}
                        </h5>
                        <div className="card-image">
                            <img alt="home-card" src={post.photo}/>
                        </div>
                        <div className="card-content">
                            {post.likes.includes(state._id)
                                ?<i className="material-icons" style={{color: "red"}} onClick={() => dislikePost(post._id)}>favorite</i>
                                :<i className="material-icons" onClick={() => likePost(post._id)}>favorite_border</i>
                            }
                            <h6>liked: {post.likes.length}</h6>
                            <h6>{post.title}</h6>
                            <p>{post.body}</p>
                            {
                                post.comments.map(comment => {
                                    return(
                                        <h6 key={comment._id}>
                                            <Link to={comment.postedBy._id == state._id?'/profile/':'/profile/'+comment.postedBy._id}><span style={{fontWeight: "500"}}>{comment.postedBy.username}:</span> </Link>
                                        {comment.text}</h6>
                                    );
                                })
                            }
                            <form onSubmit={(e) =>{
                                e.preventDefault();
                                makeComment(e.target[0].value, post._id);
                            }}>
                                <input type="text" placeholder="add a comment" />
                            </form>
                        </div>
                    </div>
                    );
                })
            }

        </div>
    );
}

export default Home;