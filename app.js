const express = require('express');
const app = express();
const exphbr = require('express-handlebars');
const bodyParser = require('body-parser');
const roomsModel = require("./models/rooms");

//Load the environment variable file
require('dotenv').config({path:"./config/keys.env"})

// Load the controllers 
const roomsController = require("./controllers/rooms_controller");

//map each controller to app object 
app.use("/room-listing",roomsController);

app.use(express.static('CSS and Images'));
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('handlebars', exphbr());
app.set('view engine','handlebars');

app.get('/',(req,res) =>{
    res.render("home", {
        title:"Welcome to TravellingBud ",
        title2:"Featured Room Listings",
        heading: "Featured Rooms Just For You",
        rooms: roomsModel.getallProducts()

    })
})

app.get('/home',(req,res) =>{
    res.render("home", {
        title:"Welcome to TravellingBud ",
        title2:"Featured Room Listings",
        heading: "Featured Rooms Just For You",
        rooms: roomsModel.getallProducts()
    })
})


app.get("/login", (req,res) => {

    res.render("login", {
        title:"Log In",
       
    });

})

app.get("/sign_up", (req,res) => {

    res.render("sign_up", {
        title:"Sign Up Here",
       
    });

})

app.get("/dashboard", (req,res) => {

    res.render("dashboard", {
        title:"Dashboard",
       
    });

})


/*******LOGIN VALIDATIONS **********/

app.post("/validation", (req,res) =>{

    const errors = [];

    if(req.body.email == "")
    {
        errors.push("Sorry, You must enter an email");
    }

    if(req.body.pass == ""){
        errors.push("Sorry, You must create a password to continue");
    }

    if(req.body.pass.length > 9)
    {
        errors.push("Please enter a password less than 9 words");
    }

    if(errors.length > 0){
        res.render("login",
        {
            messages : errors
        })
    }

})

/*******HOME PAGE VALIDATIONS **********/

app.post("/validate-home", (req,res)=>{

    const errors=[];

    if(req.body.check_in.value == undefined){
        errors.push("Please Enter a date for check in");
    }

    if(req.body.check_out.value == undefined){
        errors.push("Please Enter a date for check out");
    }

    if(errors.length > 0 )
    res.render("home",{
        messages:errors
    }
    )
})

/*******SIGN-UP PAGE VALIDATIONS **********/


app.post("/sign_up", (req,res)=>{

    const errors=[];

    if(req.body.frst_nme == ""){
        errors.push("Please enter your first name in order to continue");
        
    }

     if(req.body.lst_nme == ""){
         errors.push("Please enter your last name in order to continue");
     }

    
    if(req.body.psswrd == undefined){
        errors.push("Please enter your password name in order to continue");
    }

    if(req.body.psswrd.length > 9){
        errors.push("Please create a password less than 9 words");
    }

    if(req.body.usr_rg_eml==""){
        errors.push("Please Enter you email address in order to continue");
        
    }

    if(req.body.brthdy==undefined){
        errors.push("Please Enter your date of birth to continue");
    }

    if(errors.length > 0 )
    {
    console.log(errors);
    res.render("sign_up",{
        messages:errors
    })
    }
    else{
    
    // const sgMail = require('@sendgrid/mail');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    // const msg = {
    //   to: `prabhjot.singh232@gmail.com`,
    //   from: 'noreply@travellingBud.com',
    //   subject: 'Welcome to TravellingBud',
    //   text: `Hello ${req.body.first_nme} ${req.body.last_nme}, welcome to Travelling Bud`,
    // };
    // sgMail.send(msg)
   
   client.messages
     .create({
        body: `${req.body.first_nme} ${req.body.last_nme} Message: Welcome to TravellingBud Bro`,
        from: '+14805088327',
        to: `${req.body.ph_No}`
      })
     .then(message =>{ 
        console.log(message.sid);
        res.redirect("dashboard");
     })
     
     }

    });
    
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("The server is up and running");
})
