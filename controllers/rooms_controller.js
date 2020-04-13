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

// router.get("/admin_dash",(req,res)=>{
//     res.render("../views/room_forms/createRoom")
// })

router.get("/create_rooms",(req,res)=>{
    res.render("../views/room_forms/createRoom")
})

router.post("/create_rooms",(req,res)=>{

    const newRoom = {
        Title:req.body.title,
        Price: req.body.price,
        Description: req.body.description,
        Location: req.body.location,
        FeaturedRoom:req.body.ftrd_rm,

    };

    const user = new adminModel(newRoom);

    user.save()
    .then((user)=>{
        req.files.roomPic.name = `room_pic_${user._id}${path.parse(req.files.roomPic.name).ext}`;
        req.files.roomPic.mv(`CSS and Images/room_pics/${req.files.roomPic.name}`)
        .then(()=>{

            adminModel.updateOne({_id:user._id},
                {
                    roomPic:req.files.roomPic.name
                })
            
                .then(()=>{
                    res.redirect(`/room-listing/room_pic/${user._id}`);
                })
        })
    })

    .catch(err=>console.log(`An error while creating the rooms ${err}`));

});

/*******Route to view rooms ********/

router.get("/view_rooms",(req,res)=>{

    adminModel.find()

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

        res.render("../views/room_forms/viewRooms",{
            rooms:rooms_data,
        });

    })

    .catch(err=>console.log(`Error occured while displaying the data ${err}`))

})

/*************Route to edit rooms *****************/

router.get("/edit_rooms/:id",(req,res)=>{

    adminModel.findById(req.params.id)

    .then((task)=>{

        const {_id,Title,Price,Description,Location,FeaturedRoom} = task;

        res.render("../views/room_forms/updateRooms",{

            _id,
            Title,
            Price,
            Description,
            Location,
            FeaturedRoom
        });
    })

    .catch(err=>console.log(`Error occured when pulling into the database ${err}`));
})

/*************** Route to update Rooms *********/

router.put("/updateRooms/:id",(req,res)=>{

    const task = {
        Title:req.body.title,
        Description:req.body.description,
        Price:req.body.price,
        Location:req.body.location,
        FeaturedRoom:req.body.ftrd_rm
    }

    adminModel.updateOne({_id:req.params.id},task)

    .then(()=>{
        res.redirect("/room-listing/view_rooms")
    })

    .catch(err=>console.log(`Error occured when pulling into the database ${err}`));

})

/*************** Route to delete rooms **************/

router.delete("/delete/:id",(req,res)=>{

    adminModel.deleteOne({_id:req.params.id})
    
    .then(()=>{
        res.redirect("/room-listing/view_rooms");
    })

    .catch(err=>console.log(`Error occured while deleting the record ${err}`));

})


/*********************** */

router.get('/room_pic/:id',(req,res)=>{

    adminModel.findById(req.params.id)
    .then((user)=>{

        const {roomPic} = user;

        res.render("room_forms/viewRoom2",{

            roomPic
        });
    })

    .catch(err=>{console.log("error occured when loading the image")})
})

module.exports = router;