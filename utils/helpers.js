//truncate : means if the words greater than 100 we truncate the post

const truncatePost = (post)=>{
    if(post.length>100){
        return post.substring(0,100)+'...';
    }else{
        return post
    }
}
module.exports={
    truncatePost,
}