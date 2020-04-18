const jwt = require('jsonwebtoken');
const User = require('./models/user.model');

const auth = async(request, response, next) => { 
    try{
        const token = request.header('Authorization').replace('Bearer ','');
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({_id: data._id, 'tokens.token': token})
        if(!user){
            throw new Error();
        }
        request.user = user;
        request.token = token;
        next()
    }catch(error){
        response.status(401).json({
            "code":"INVALID_CREDENTIALS",
            "message": `Not authorised to access this resource with error: ${error}`
        })
    }
}

module.exports = auth