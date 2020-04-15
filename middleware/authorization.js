const AdminorUser = (req,res,next)=>{


    if(req.session.userInfo.type=="Admin")
    {
        res.render("../views/dashboards/AdminDash");
    }

    else{
        res.render("../views/dashboards/dashboard");
    }
}

module.exports = AdminorUser;
