const Post = require("../../models/posts/Post")
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

const createPostCntlr = async (req,res,next)=>{
    const {title,description,category,Image,user} = req.body;
    try {
        if(!title || !description || !category || !req.file){

            return res.render('posts/addPost',{
                error:'All fields are required'
            })
        }
        const userId = req.session.userAuth; //To find the currently logined user
        const userFound = await User.findById(userId)
        //Create post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user:req.session.userAuth,
            Image:req.file.path
        })
        //push the post created to the array of users post
        userFound.posts.push(postCreated._id)
        //resave
        await userFound.save()
        res.redirect('/')
    } catch (error) {
        return res.render('posts/addPost',{
            error:error.message
        })
    }
    }
  const fetchPostsCtrl=  async (req,res,next)=>{
        try {

            const post = await Post.find().populate('user').populate('comments')
            res.render('posts/addPost',{
                post

            });

        } catch (error) {
       next(appErr(error.message))
        }
        }
  const FetchSinglePostCtrl = async (req,res,next)=>{
    try {
        const id = req.params.id
        const post = await Post.findById(id).populate({
          path:'comments',
          populate:{
            path:'user',
          },
        }).populate('user')
        //if(post.user.toString() !== req.session.userAuth){
        // console.log(post.user._id.toString());
        // console.log(req.session.userAuth)
       // <%if(post?.user._id.toString() === post?.loginUser) { %>

        res.render('posts/postDetails',{
            post,
            error:""
        })
    } catch (error) {
        next(appErr(error.message))
    }
    }
const deletePostCtrl =  async (req,res,next)=>{

                try {
                   // console.log(res.locals.loginUser)
                 //  const userHere = res.session.userAuth;
                   // const {title,description,category,Image,user} = req.body;
                    const id = req.params.id;
                    //find post
                    const post = await Post.findById(req.params.id);
                    //check if the post belongs to the user
                    // console.log(post.user.toString())


                    if(post.user._id.toString() !== req.session.userAuth){  //post.user is an object not string,to make it an string we use .toString


                         return res.render('posts/postDetails',{

                            error:"You are not allowed to delete this post",
                            post,
                         })


                    }

                        await Post.findByIdAndDelete(req.params.id);
                       res.redirect('/')




                } catch (error) {
                    return res.render('posts/postDetails',{
                        error:error.message,
                        post:""
                     })
                }
                }
const updatePostCtrlr= async (req,res,next)=>{
const {title,description,category}=req.body

    try {
        //find the post
        const post = await Post.findById(req.params.id);
        //check if the post belongs to the user
        if (post.user.toString() !== req.session.userAuth.toString()) {
          return res.render("posts/updatePost", {
            post: "",
            error: "You are not authorized to update this post",
          });
        }
        //check if user is updating image
        if (req.file) {
          await Post.findByIdAndUpdate(
            req.params.id,
            {
              title,
              description,
              category,
              image: req.file.path,
            },
            {
              new: true,
            }
          );
        } else {
          //update
          await Post.findByIdAndUpdate(
            req.params.id,
            {
              title,
              description,
              category,
            },
            {
              new: true,
            }
          );
        }

        //redirect
        res.redirect("/");
      } catch (error) {
        return res.render("posts/updatePost", {
          post: "",
          error
        });
      }
    };

    module.exports={
        createPostCntlr,
        fetchPostsCtrl,
        FetchSinglePostCtrl,
        deletePostCtrl,
        updatePostCtrlr
    }