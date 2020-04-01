const express = require('express');
const exphbr = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

//Load the environment variable file
require('dotenv').config({path:"./config/keys.env"})


app.use(express.static('CSS and Images'));
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('handlebars', exphbr());
app.set('view engine','handlebars');
    

app.use((req,res,next)=>{

    if(req.query.method == "PUT")
    {
        req.method="PUT"
    }

    else if(req.query.method == "DELETE")
    {
        req.method="DELETE"
    }

    next();
})

// Load the controllers 
const generalController = require("./controllers/general")
const roomsController = require("./controllers/rooms_controller");

//map each controller to app object 
app.use("/",generalController)
app.use("/room-listing",roomsController);


//DATABASE CONNECTION 

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to the MongoDB server");
})
.catch(err=>{console.log(`There is an error ${err}`)})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("The server is up and running");
})
