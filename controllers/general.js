const express = require('express');
const router = express.Router();
const roomsModel = require("../models/rooms");

router.get("/login", (req,res) => {

    res.render("login", {
        title:"Log In",
       
    });

})

router.get('/',(req,res) =>{
    res.render("../views/home", {
        title:"Welcome to TravellingBud ",
        title2:"Featured Room Listings",
        heading: "Featured Rooms Just For You",
        rooms: roomsModel.getallProducts()

    })
})

router.get('/home',(req,res) =>{
    res.render("../views/home", {
        title:"Welcome to TravellingBud ",
        title2:"Featured Room Listings",
        heading: "Featured Rooms Just For You",
        rooms: roomsModel.getallProducts()
    })
})



router.get("/sign_up", (req,res) => {

    res.render("sign_up", {
        title:"Sign Up Here",
       
    });

})

router.get("/dashboard", (req,res) => {

    res.render("dashboard", {
        title:"Dashboard",
        
    });

})

/*******LOGIN VALIDATIONS **********/

router.post("/validation", (req,res) =>{

    const errors = [];
    const {email,pass} = req.body;
    

    if(`${email}` == "")
    {
        errors.push("Sorry, You must enter an email");
    }

    if(`${pass}` == ""){
        errors.push("Sorry, You must create a password to continue");
    }

    if(`${pass}`.length > 9)
    {
        errors.push("Please enter a password less than 9 words");
    }

    if(errors.length > 0){
        res.render("../views/login",
        {
            messages : errors
        })
    }

})

/*******HOME PAGE VALIDATIONS **********/

router.post("/validate-home", (req,res)=>{

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


router.post("/sign_up", (req,res)=>{

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
    res.render("../views/sign_up",{
        messages:errors
    })
    }
    else{
    
    const sgMail = require('@sendgrid/mail');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
      to: `${req.body.user_rg_eml}`,
      from: 'noreply@travellingBud.com',
      subject: 'Welcome to TravellingBud',
      text: `Hello ${req.body.first_nme} ${req.body.last_nme}, welcome to Travelling Bud`,
    };
    sgMail.send(msg)
    .then(()=>{
        
    })

    .catch((err)=>{
        console.log(err);
    })
   
   client.messages
     .create({
        body: `${req.body.first_nme} ${req.body.last_nme} Message: Welcome to TravellingBud Bro`,
        from: '+14805088327',
        to: `${req.body.ph_No}`
      })
     .then(message =>{ 
        console.log(message.sid);
        res.render("dashboard");
     })
     .catch(err=>{
         console.log(err);
     })
     
     }

    });

    

module.exports = router;