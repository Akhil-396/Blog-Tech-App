const Post = require("../../models/posts/Post")
const User = require("../../models/user/User")
const Comment = require("../../models/comment/Comment");
//const { validate } = require("../../models/posts/Post");
const appErr = require("../../utils/appErr");
const createCmtCtrl = async (req, res, next) => {
    const { message } = req.body;
    try {
      //Find the post
      const post = await Post.findById(req.params.id);
      //create the comment
      const comment = await Comment.create({
        user: req.session.userAuth,
        message,
        post: post._id,
      });
      //push the comment to post
      post.comments.push(comment._id);
      //find the user
      const user = await User.findById(req.session.userAuth);
      //push the comment into
      user.comments.push(comment._id);
      //disable validation
      //save
      await post.save({ validateBeforeSave: false });
      await user.save({ validateBeforeSave: false });
      //console.log(post);
      //redirect
      res.redirect(`/api/v1/posts/${post._id}`);
    } catch (error) {
      next(appErr(error));
    }
  };

  //single
  const commentDetailsCtrl = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id);
      res.render("comments/updateComment", {
        comment,
        error: "",
      });
      //console.log("comment", comment);
    } catch (error) {
      res.render("comments/updateComment", {
        error: error.message,
      });
    }
  };

  //delete
  const deleteComment = async (req, res, next) => {
   // console.log(req.query.postId);
    try {
      //find the comment
      const comment = await Comment.findById(req.params.id);
      //check if the comment belongs to the user
      if (comment.user.toString() !== req.session.userAuth.toString()) {
        return next(appErr("You are not allowed to delete this comment", 403));
      }
      //delete comment
      await Comment.findByIdAndDelete(req.params.id);
      //redirect
      res.redirect(`/api/v1/posts/${req.query.postId}`);//here actually we want to pass the post._id but in this finction there is no post so that we are fetching the post id from the postDetails.ejs with the help of method override.Please check postDetails line num 106//
      //console.log(req.query.postId);
    } catch (error) {
      next(appErr(error));
    }
  };

  //Update
  const commentUpdate = async (req, res, next) => {
    try {
      console.log("query", req.query);
      //find the comment
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return next(appErr("Comment Not Found"));
      }
      //check if the post belongs to the user
      if (comment.user.toString() !== req.session.userAuth.toString()) {
        return next(appErr("You are not allowed to update this comment", 403));
      }
      //update
      const commentUpdated = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          message: req.body.message,
        },
        {
          new: true,
        }
      );

      //redirect
     // console.log(req.query.postId);
      res.redirect(`/api/v1/posts/${req.query.commentId}`);
    } catch (error) {
      next(appErr(error));
    }

                }

    module.exports ={
        createCmtCtrl,
        commentDetailsCtrl,
        deleteComment,
        commentUpdate
    }