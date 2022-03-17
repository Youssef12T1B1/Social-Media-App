module.exports.validateRegister = (
    username,
    email, 
    password,
    confirmPassword
) =>{
    const errors = {}
  
    if(username.trim()==='')  errors.username = 'Username Must not be Empty'
    if( email.trim()===''){
        errors.email = 'Email Must not be Empty'
    } else{
        const regEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        if(!email.match(regEx)) errors.email = 'invalid email address'
    }
    if( password ==='') errors.password = 'Password Must not be Empty'
    if( confirmPassword.trim() ==='') errors.confirmPassword = 'PasswordConfrim Must not be Empty'
   if(password !== confirmPassword ) errors.confirmPassword = 'Passwords must match'
 
   return{
       errors,
       valid : Object.keys(errors).length <1
   }

}