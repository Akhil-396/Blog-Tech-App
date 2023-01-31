const bcrypt = require("bcryptjs");
const Post = require("../../models/posts/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");


//register
const registerController = async (req, res, next) => {
  const { fullname, email, password, bio,role } = req.body;
  //check if field is empty
  if (!fullname || !email || !bio || !role || !password ) {
    // return next(appErr("All fields are required"));
    return res.render("users/register", {
      error: "All fields are required",
    });
  }
  try {
    //1. check if user exist (email)
    const userFound = await User.findOne({ email });
    //throw an error
    if (userFound) {
      return res.render("users/register", {
        error: "Exist is taken",
      });
    }
    //Hash passsword
    const salt = await bcrypt.genSalt(10);
    const passswordHashed = await bcrypt.hash(password, salt);
    //register user
    const user = await User.create({
      fullname,
      email,
      bio,
      password: passswordHashed,
    });
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

//login
const logincntrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("users/login", {
      error: "Email and password fields are required",
    });
   // return next(appErr("Email and password fields are required"));
  }
  try {
    //Check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) {
      //throw an error
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    //verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      //throw an error
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    //save the user into
    req.session.userAuth = userFound._id;
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

//details
const userDetails = async (req, res) => {
  try {
    //get userId from params
    const userId = req.params.id;
    //find the user
    const user = await User.findById(userId);
    res.render("users/updateUser",
     {
      user,
      error:"",
    });
  } catch (error) {
    res.render("users/updateUser", {

      error:error.message,
    });
  }
};
//profile
const profileCtrl = async (req, res) => {
  try {
    const {title,description,category,Image} = req.body
    //get the login user
    const userID = req.session.userAuth;
    //find the user
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");
      const post = await Post.find()
    res.render("users/profile", { user,post });
  } catch (error) {
    res.json(error);
  }
};

//upload profile photo
const uploadProfilePicCtrl = async (req, res, next) => {
  try {
    //check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    //1. Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    //5.Update profile photo
    const updateuser = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//upload cover image

const uploadCoverPicCtrl = async (req, res) => {
  try {
    //check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    //1. Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    //5.Update profile photo
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//update password
const updatepwdCntrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    //Check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passswordHashed = await bcrypt.hash(password, salt);
      //update user
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: passswordHashed,
        },
        {
          new: true,
        }
      );
      res.redirect("/api/v1/users/profile-page",);
    }
  } catch (error) {
    return res.render("users/updatePwd", {
      error: error.message,
    });
  }
};

//update user
const updateuser = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "Please provide details",
        user: "",
      });
    }
    //Check if email is not taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render("users/updateUser", {
          error: "Email is taken",
          user: "",
        });
      }
    }
    //update the user
   const user= await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile-page",{
      user
    });
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};

//logout
const logoutCtrl = async (req, res) => {
  //destroy session
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

module.exports = {
    registerController,logincntrl,userDetails,profileCtrl, uploadProfilePicCtrl,uploadCoverPicCtrl,updatepwdCntrl,updateuser,logoutCtrl
};
