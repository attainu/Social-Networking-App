//Importing the modules
let dotenv = require("dotenv");
dotenv.config()
let express = require("express");
let userRoutes = require("./routes/userRoutes");
let postRoutes = require("./routes/postRoutes");
let app = express();
require("./db");

//To remove CORS 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

//Body Parser
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Routes
app.use(userRoutes);
app.use(postRoutes);

//Listing to the server
app.listen(8089, () => console.log("Server connected"));