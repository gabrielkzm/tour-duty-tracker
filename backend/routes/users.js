const router = require('express').Router();
let User = require('../models/user.model');
const auth = require('../auth.js');

// POST/ users
// Uncomment for creation of user
// router.route('/').post(async (request, response) => {
//     try{
//         const user = new User(request.body)
//         await user.save()
//         const token = await user.generateAuthToken()
//         response.status(201).json({
//             "user": user,
//             "token": token,
//             "code": "CREATED",
//         })
//     }catch(error){
//         response.status(400).json({
//             "code":"CREATION_FAILED",
//             "message": error
//         })
//     }
// });

// POST/ users
// Login
router.route('/login').post((request, response) => {
    const {username, password} = request.body
    User.findByCredentials(username, password)
        .then(user => {
            user.generateAuthToken()
                .then(token => response.status(200).json({
                    "user": user,
                    "token": token,
                    "code": "SUCCESS"
                }))
                .catch(error => {
                    console.log(error);
                    response.status(500).json({
                        "code":"SERVER_ERROR",
                        "message": error
                    })
                })
        })
        .catch(error => response.status(401).json({
            "code": "INVALID_CREDENTIALS",
            "message": error
        }));
});

// DEL/ users
// Uncomment to delete user
// router.route('/:id').delete(auth, (request, response) => {
//     User.findByIdAndDelete(request.params.id)
//         .then(() => response.status(200).json({
//             "code": "DELETED",
//             "message": `User has been deleted.`}))
//         .catch(error => response.status(400).json({
//             "code": "INVALID_INPUT",
//             "message": error}));
// });

// DEL/ users
// Logout
router.route('/logout').delete(auth, async (request, response) => {
    try{
        request.user.tokens = request.user.tokens.filter((token) =>{
            return token.token !== request.token
        })
        await request.user.save();
        response.status(200).json({
            "code": "SUCCESS",
            "message": `This session of ${request.user.username} logged out`
        })
    }catch(error){
        response.status(500).json({
            "code":"INTERNAL_ERROR",
            "message": error
        })
    }
});

// DEL/ users
// Logout ALL
router.route('/logout/all').delete(auth, async (request, response) => {
    try{
        request.user.tokens.splice(0, request.user.tokens.length);
        await request.user.save();
        response.status(200).json({
            "code": "SUCCESS",
            "message": `All session(s) of ${request.user.username} logged out`
        })
    }catch(error){
        response.status(500).json({
            "code":"INTERNAL_ERROR",
            "message": error
        })
    }
});

module.exports = router;