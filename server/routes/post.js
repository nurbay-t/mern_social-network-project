const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin.js');
const Post = mongoose.model("Post");


router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id username")
    .populate("comments.postedBy", "_id username")
    .then(posts => {
        res.json({posts});
    }).catch(err => {
        console.log("allpost error");
    });
});

router.get('/followingpost', requireLogin, (req, res) => {
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id username")
    .populate("comments.postedBy", "_id username")
    .then(posts => {
        res.json({posts});
    }).catch(err => {
        console.log("allpost error");
    });
});

router.post('/createpost', requireLogin, (req, res) => {
    const {title, body, photo} = req.body;
    if (!title || !body || !photo) {
        return res.status(422).json({error: "Please, add all the fields"});
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    });
    post.save().then(result => {
        return res.json({post: result});
    }).catch(err => {
        console.log("post save error");
    })
});

// mypost -> myposts
router.get('/myposts', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id username")
    .then(myposts => {
        res.json({myposts});
    }).catch(err => {
        console.log("myposts error");
    });
});

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    }, {
        new: true
    })
    .populate("postedBy", "_id username")
    .populate("comments.postedBy", "_id username")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({error: err});
        }
        res.json(result);
    });
});

router.put('/dislike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    }, {
        new: true
    })
    .populate("postedBy", "_id username")
    .populate("comments.postedBy", "_id username")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({error: err});
        }
        res.json(result);
    });
});

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment}
    }, {
        new: true
    })
    .populate("postedBy", "_id username")
    .populate("comments.postedBy", "_id username")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({error: err});
        }
        res.json(result);
    });
});

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if (err || !post) {
            return res.status(422).json({error: err});
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json({message: "deleted successfully"});
            })
            .catch(err => {
                console.log("delete post error");
            })
        }
    });
});


module.exports = router;