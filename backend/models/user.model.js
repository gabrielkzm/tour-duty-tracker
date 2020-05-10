const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {type: String, required: true, trim: true},
        password: {type: String, required: true, minlength: 7},
        tokens: [{
            token: {type: String, required: true}
        }]
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next){
    const user = this;
    if(user.isModified('password')){
        console.log('modified');
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens.push({token});
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(username, password) => {
    const user = await User.findOne({username})
    if(!user){
        throw new Error ({message:'Invalid login credentials'})
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(!isPasswordMatch){
        throw new Error({message: 'Invalid login credentails'})
    }

    return user
}

const User = mongoose.model('User', userSchema);

module.exports = User;