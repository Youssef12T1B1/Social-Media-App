const Post = require('../../models/post')
module.exports = {
   Query: {
    async getPosts(){
      try{
          const posts = await Post.find()
          return posts
      }
      catch(err){
          console.log(err);
          throw err
      }
     }
 }

}