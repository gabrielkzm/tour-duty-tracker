const router = require('express').Router();
const auth = require('../auth.js');

let Settings = require('../models/settings.model');

// GET/ settings
router.route('/').get(auth, (_, response) => {
    Settings.find({}, '-__v -createdAt -updatedAt')
        .then(settings => response.status(200).json({
            "code":"SUCCESS",
            "settings": settings}))
        .catch(error => response.status(400).json({
            "code": "INALID_INPUT",
            "message": error}));
});


// POST/ settings
router.route('/').post(auth, (request, response) => {
    //TODO: to confirm details to take note
    const tourAssignerName = request.body.tourAssignerName;
    const tourAssignerContact = request.body.tourAssignerContact;
    const tourAssignerEmail = request.body.tourAssignerEmail;
    const additionalDistributionList = request.body.additionalDistributionList;
    
    const settings = new Settings({
        tourAssignerName,
        tourAssignerContact,
        tourAssignerEmail,
        additionalDistributionList
    });

    settings.save()
        .then(()=> response.status(201).json({
            "settings": settings,
            "code" : "ADDED",
            "message": `Settings has been added successfully.`}))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error}));
});

// PUT/ settings
router.route('/:id').put(auth, (request, response) => {
    Settings.findById(request.params.id)
        .then(settings => {
            settings.tourAssignerName = request.body.tourAssignerName;
            settings.tourAssignerContact = request.body.tourAssignerContact;
            settings.tourAssignerEmail = request.body.tourAssignerEmail;
            settings.additionalDistributionList = request.body.additionalDistributionList;
            
            settings.save()
                .then(() => response.status(200).json({
                    "settings": settings,
                    "code": "UPDATED",
                    "message": `Settings has been updated successfully.`}))
                .catch(error => response.status(400).json({
                    "code": "INVALID_INPUT",
                    "message" : error}));
        })
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message:": error}));
});

module.exports = router;