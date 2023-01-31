const appErr = require("../utils/appErr");

const protected = (req,res,next)=>{
    if(req.session.userAuth){   //user logined
        next()
    }else{
        res.render('users/notAuthorize')
    }
}

module.exports = protected;

