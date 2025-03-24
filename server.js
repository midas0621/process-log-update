const express = require("express");
const bodyParser = require("body-parser");
const ipCheckRouter = require("./routes/ipCheckRoute");

const app = express();
require('dotenv').config()

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/ipcheck', ipCheckRouter);

app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
});

const server = app.listen(4444, () => {
    console.log(`Server running`)
});

// error middleware
// app.use(errorMiddleware);

module.exports = app;
