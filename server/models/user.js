const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "https://res.cloudinary.com/ryjsefsnhgs/image/upload/v1620493052/blank-profile-picture-973460_640_bb98j0.png"
    },
    followers:[{
            type: ObjectId,
            ref: "User"
        }],
    following:[{
            type: ObjectId,
            ref: "User"
        }]
});

mongoose.model("User", userSchema);