import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({html: data.error, classes: "red darken-1"});
                } else {
                    M.toast({html: "A post was created", classes: "blue darken-1"});
                    history.push('/');
                }
            })
            .catch(err => {console.log("postData: " + err)});
        }
    }, [url]);

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
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
            console.log(err);
        });
    }

    return(
        <div className="card input-field create-post">
            <input type="text" placeholder="title" onChange={(e) => setTitle(e.target.value)}/>
            <input type="text" placeholder="body" onChange={(e) => setBody(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn blue darken-1">
                    <span>Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect blue darken-1" onClick={() => postDetails()}>Create</button>
        </div>
    );
}

export default CreatePost;