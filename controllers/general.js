const express = require('express');
const router = express.Router();
const roomsModel = require("../models/rooms");
const userModel = require("../models/dash");
const adminModel = require("../models/adminRooms");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const LoggedIn = require("../middleware/auth");
const AdminorUser = require("../middleware/authorization")

router.use(express.static('CSS and Images'));

router.get("/login",(req,res) => { 

    res.render("login", {
        title:"Log In",
       
    });

})

router.get('/',(req,res) =>{
    adminModel.find({FeaturedRoom:"Yes"})
 
    .then((records)=>{ 

        const rooms_data = records.map(record =>{
            
            return {
                id:record._id,
                Title:record.Title,
                Price:record.Price,
                Description:record.Description,
                Location:record.Location,
                FeaturedRoom:record.FeaturedRoom,
                roomPic:record.roomPic
                
            }
        })

        res.render("../views/general/home",{
            rooms:rooms_data,
            heading:"Featured Rooms"
        });

    })

    .catch(err=>console.log(`Error occured while displaying the data ${err}`))

})


router.get('/home',(req,res) =>{

    
    // res.render("../views/general/home", {
    //     title:"Welcome to TravellingBud ",
    //     title2:"Featured Room Listings",
    //     heading: "Featured Rooms Just For You",
    //     // rooms: roomsModel.getallProducts()
    // })
    adminModel.find({FeaturedRoom:"Yes"})
 
    .then((records)=>{ 

        const rooms_data = records.map(record =>{
            
            return {
                id:record._id,
                Title:record.Title,
                Price:record.Price,
                Description:record.Description,
                Location:record.Location,
                FeaturedRoom:record.FeaturedRoom,
                roomPic:record.roomPic
                
            }
        })

        res.render("../views/general/home",{
            rooms:rooms_data,
            heading:"Featured Rooms"
        });

    })

    .catch(err=>console.log(`Error occured while displaying the data ${err}`))

})

router.get("/sign_up", (req,res) => {

    res.render("sign_up", {
        title:"Sign Up Here",
       
    });

})

router.get("/dashboard",LoggedIn,AdminorUser ,(req,res) => {

    res.render("../views/dashboards/dashboard", {
        title:"Dashboard",
        
    }); 

})

/*******LOGIN VALIDATIONS **********/

router.post("/validation", (req,res) =>{

    
    userModel.findOne({Email:req.body.email})
    .then(user=>{
        const errors = [];

        if(`${req.body.email}` == "" && `${req.body.Pass}` == "")
         {
             errors.push("Sorry, You must enter an email and a password");
         }

        if(user == null)
        {
            errors.push("Sorry , you must enter valid credentials!");
            res.render("../views/login",
                 {
                     messages : errors
                 })
        }

        else
        {
            bcrypt.compare(req.body.Pass, user.Password)
            .then(isMatched=>{

                if(isMatched)
                {
                    req.session.userInfo = user; 
                    res.redirect('/dashboard');
                }
  
                else
                {
                    errors.push("Sorry , you have entered invalid credentials!");
                    res.render("../views/login",
                 {
                     messages : errors
                 }) 
                }
            })
            .catch((err)=>console.log(err));
        }
    })
    .catch((err)=>console.log(err));

  

    // if(`${email}` == "")
    // {
    //     errors.push("Sorry, You must enter an email");
    // }

    // if(`${pass}` == ""){
    //     errors.push("Sorry, You must create a password to continue");
    // }

    // if(`${pass}`.length > 9)
    // {
    //     errors.push("Please enter a password less than 9 words");
    // }

    // if(errors.length > 0){
    //     res.render("../views/login",
    //     {
    //         messages : errors
    //     })
    // }

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
    res.render("../views/general/home",{
        messages:errors
    }
    )
})

/*******SIGN-UP PAGE VALIDATIONS **********/


router.post("/sign_up", (req,res)=>{

    const errors=[];

    if(req.body.first_nme == ""){
        errors.push("Please enter your first name in order to continue");
        
    }

     if(req.body.last_nme == ""){
         errors.push("Please enter your last name in order to continue");
     }

    
    if(req.body.psswrd == undefined){
        errors.push("Please enter your password name in order to continue");
    }

    if(req.body.psswrd.length > 9){
        errors.push("Please create a password less than 9 words");
    }

    if(req.body.user_rg_eml=="" || req.body.ph_No ==""){
        errors.push("Please Enter you email address and phone number in order to continue");
        
    }

    if(req.body.brthdy==undefined){
        errors.push("Please Enter your date of birth to continue");
    }

    if(errors.length > 0 )
    {
    // console.log(errors);
    res.render("../views/sign_up",{
        messages:errors
    })
    }

    else{
        
    const newUser = {
        
        FirstName: req.body.first_nme,
        LastName: req.body.last_nme,
        Password:req.body.psswrd,
        Email:req.body.user_rg_eml,
        PhoneNo:req.body.ph_No,
        DateOfBirth:req.body.brthdy
    }

    const user = new userModel(newUser);
    
    user.save()
    
    .then(()=>{
        console.log("User created in the database");
    })

    .catch(error=>console.log(`Error While creating the user ${error}`))

    //SMS and EMAIL 
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
        // console.log(message.sid);
        res.render("../views/signup_login",{
        name:`${req.body.first_nme} ${req.body.last_nme}`
        });
     })
     .catch(err=>{
         console.log(err);
     })

     }

    });


/***************Room Pics Route **************/

router.get("/room_pic/:id",(req,res)=>{

    adminModel.findById(req.params.id)
    .then((user)=>{

        const {roomPic} = user;

        res.render("../views/dashboards/AdminDash",{
        roomPic
        }
        )
    })

    .catch(err=>console.log(`Error displaying rooms from the database ${err}`));
})

/***************** LOGOUT Route ***********/

router.get("/logout",(req,res)=>{

    req.session.destroy();
    res.redirect("/login")
})

module.exports = router;