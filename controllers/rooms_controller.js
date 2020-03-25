const express = require('express');
const router = express.Router();

const roomsModel = require("../models/rooms");

router.get("/", (req,res) => {

    res.render("../views/room-listing", {
        title2:"Featured Room Listings",
        heading: "Featured Rooms Just For You",
        rooms: roomsModel.getallProducts()
    });

})



module.exports = router;