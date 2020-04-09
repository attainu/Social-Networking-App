//Importing the modules
let dotenv = require("dotenv");
dotenv.config()
let express = require("express");
let userRoutes = require("./routes/userRoutes");
let postRoutes = require("./routes/postRoutes");
let commentRoutes = require("./routes/commentRoutes");
let inboxRoutes = require("./routes/inboxRoutes");
let app = express();
require("./db");

//To remove CORS 
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next();
});


//Body Parser
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Routes
app.use(userRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(inboxRoutes);

//Listing to the server
app.listen(8089, () => console.log("Server connected"));