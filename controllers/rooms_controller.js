const express = require('express');
const router = express.Router();
const adminModel = require("../models/adminRooms");
const path = require("path");
const roomsModel = require("../models/rooms");


router.use(express.static('CSS and Images'));


router.get("/", (req,res) => {

    res.render("../views/room-listing", {
        title2:"Featured Room Listings",
        heading: "Featured Rooms Just For You",
        rooms: roomsModel.getallProducts()
    });

})

router.get("/admin_dash",(req,res)=>{
    res.render("../views/room_forms/createRoom")
})

router.get("/create_rooms",(req,res)=>{
    res.render("/views/room_forms/createRoom")
})

router.post("/create_rooms",(req,res)=>{

    const newRoom = {
        Title:req.body.title,
        Price: req.body.price,
        Description: req.body.description,
        Location: req.body.location,
        FeaturedRoom:req.body.ftrd_rm,

    };

    const room = new adminModel(newRoom);

    room.save()
    // .then((room)=>{
    //     req.files.roomPic.name = `Room_pic_${room._id}${path.parse(req.files.roomPic.name).ext}`;
    //     req.files.roomPic.mv(`public/room_pics/${req.files.roomPic.name}`)
    //     .then(()=>{

    //             adminModel.updateOne({_id:room._id})
    //             {
    //                 roomPic:req.files.roomPic.name;
    //             }

    //     })
    // })

    .then(()=>{
        res.render("../views/dashboards/AdminDash");
    })

    .catch(err=>console.log(`An error while creating the rooms ${err}`));    
})

module.exports = router;