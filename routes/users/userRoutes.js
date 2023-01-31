const express = require("express")
const User = require("../../models/user/User")
const multer = require('multer')
const { registerController,logincntrl,userDetails,profileCtrl, uploadProfilePicCtrl,uploadCoverPicCtrl,updatepwdCntrl,updateuser,logoutCtrl } = require("../../controllers/users/userController")
const protected = require('../../middlewares/protected')
const storage = require("../../config/cloudinary")
const userRouter = express.Router()

//Instanse of multer
const upload = multer({storage})
//Rendering forms
//login form
userRouter.get('/login',(req,res)=>{
    res.render('users/login',{
        error: ''
    })
})
//render register
userRouter.get('/register',(req,res)=>{
    res.render('users/register',{
        error: ''
    })
})
//render profile
userRouter.get('/profile-page',protected, profileCtrl)
//upload profile pic
userRouter.get('/upload-profile-photo',(req,res)=>{
    res.render('users/uploadProfilePhoto',{
        error:""
    })
})
//upload cover pic
userRouter.get('/upload-cover-photo',(req,res)=>{
    res.render('users/uploadCoverPhoto',{
        error:""
    })
})
//update user password
userRouter.get('/update-user-password',(req,res)=>{
    res.render('users/updatePwd',{
        error: ""
    })
})

userRouter.post('/register',upload.single("profile"),registerController)
userRouter.post('/login',logincntrl)

userRouter.get('/profile-page',protected,profileCtrl)  //protected is for not allowing unauthorized users
userRouter.put('/profile-pic-upload',protected,upload.single('profile'),uploadProfilePicCtrl)
userRouter.put('/cover-pic-upload',upload.single('profile'),uploadCoverPicCtrl)
userRouter.put('/update-password',updatepwdCntrl)
userRouter.put('/update',updateuser)
userRouter.get('/user-logout',logoutCtrl)
userRouter.get('/:id',userDetails,
// (req,res)=>{
//     res.render('users/updateUser',{
//          error: ''})

//}
)

    module.exports = userRouter