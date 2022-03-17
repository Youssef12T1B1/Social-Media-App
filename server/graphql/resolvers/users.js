const User = require("../../models/user")
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken')
const {UserInputError} = require('apollo-server')
const jwt_Secret = require('../../config/.env').jwtSecret
const  {validateRegister} = require('../validator')
module.exports = {
  Mutation: {
    async  register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
       //validate Fields
        const {valid, errors} = validateRegister(username, email, password, confirmPassword)
       if(!valid){
           throw new UserInputError('Errors', {errors})
       }
       //unique username
       const Testuser = await User.findOne({username})
        if(Testuser){
            throw new UserInputError('Username already exists')
        }
         //hash password
        password = await bcrypt.hash(password, 12)
        const user = new User({
            username,
            email,
            password,
        })
        // new User res
        const result = await user.save()
   
        const token = jwt.sign({username : result.username,_id:result._id},
                    jwt_Secret,
                 { expiresIn: '1h' })
    
        
        return {
            ...result._doc,
            token
        }
    },
  },
};
