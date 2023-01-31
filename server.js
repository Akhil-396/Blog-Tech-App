
require('dotenv').config()
const express = require('express');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const globalErrHandler = require('./middlewares/globalErrHandler');
const commentRouter = require('./routes/comments/commentRouter');
const postRouter = require('./routes/posts/postRouter');
const userRouter = require('./routes/users/userRoutes');
const Post = require('./models/posts/Post');
const { truncatePost } = require('./utils/helpers');


require('./config/dbConnect')
const app= express();

//helpers
app.locals.truncatePost = truncatePost
//middlewares
//config ejs
app.set('view engine','ejs')

//serve static files
app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

//method override(for this 'put')
app.use(methodOverride('_method'))



//session config
app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:true,
    store: new MongoStore ({    //Saving the session onto mongodb
        mongoUrl:process.env.MONGO_URL,
        ttl: 24*60*60, //Session will expire in one day
    }),
}))
//save the login into locals :- for public and private navbar
app.use((req,res,next)=>{
    if(req.session.userAuth){
        res.locals.loginUser = req.session.userAuth; //we can give any names in loginUser field
    }
    else{
        res.locals.loginUser= null;
    }
    next()
})

//render home page

app.get("/", async(req, res) => {
    const posts = await Post.find().populate('user')
     try {
       res.render("index",{
         posts

       });
     } catch (error) {
       res.render("index",{
         error:error.message
       });
     }

   });
//user-routes
app.use('/api/v1/users',userRouter)


//post routes
app.use('/api/v1/posts',postRouter)


//comment routes

app.use('/api/v1/comments',commentRouter)

app.use(globalErrHandler )

//listen server
const PORT = process.env.PORT || 3000;

app.listen(PORT,
    console.log(`Server Created Succesfully on ${PORT}`))