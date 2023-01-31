const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const { createPostCntlr,fetchPostsCtrl,FetchSinglePostCtrl,deletePostCtrl, updatePostCtrlr } = require('../../controllers/posts/postController');

const postRouter = express.Router();
const protected = require('../../middlewares/protected');
const Post = require('../../models/posts/Post');

//instanse of multer
const upload = multer({
    storage,

})
//render
//forms
postRouter.get('/get-post',(req,res)=>{
    res.render('posts/addPost',{
        error:""
    })
})

postRouter.get('/get-update/:id',async(req,res)=>{
    try{
       const post = await Post.findById(req.params.id)
       res.render('posts/updatePost',{
        post,
        error:""

       })
    }catch(error){
    res.render('posts/updatePost',{
    error,
    post:""

       })
    }
})



postRouter.post('/',protected,upload.single('file'),createPostCntlr)

postRouter.get('/',fetchPostsCtrl)

postRouter.get('/:id',FetchSinglePostCtrl)
postRouter.delete('/:id',protected,deletePostCtrl)
postRouter.put('/:id',protected,upload.single('file'),updatePostCtrlr)

    module.exports = postRouter