const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {
    MONGOURI
} = require('./keys.js');


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log("connected to Mongo");
});
mongoose.connection.on('error', (err) => {
    console.log("connection error: ", err);
});


require('./models/user.js');
require('./models/post.js');

app.use(express.json());
app.use(require('./routes/auth.js'));
app.use(require('./routes/post.js'));
app.use(require('./routes/user.js'));


app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});