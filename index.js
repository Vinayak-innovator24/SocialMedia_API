require("dotenv").config();
const express = require("express")
const app = express()

const mongoose = require("mongoose")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const {middleware} = require("./routes/middleware")


// connecting mongodb

mongoose.connect(process.env.MONGO_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
        console.log("Connected to MongoDB")
);

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", middleware, userRoute);
app.use("/api/authenticate",  authRoute);
app.use("/api/posts", middleware, postRoute);

// using express
app.listen(3000, ()=> {
    console.log("Connected to backend server")
});

