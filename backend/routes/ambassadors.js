const router = require('express').Router();
let Ambassador = require('../models/ambassador.model');

// GET/ ambassadors
router.route('/').get((request, response) => {
    let params = request.query.filter;
    let filters = {}
    let attributesToIgnore = '';
    if(params != null){
        if(params.isMinimal === 'true'){
            attributesToIgnore = '-__v -createdAt -updatedAt -primaryDegree \
            -secondaryDegree -batch -nationality -race -year \
            -unavailabilityReason -unavailabilityFrom -unavailabilityTo \
            -mandarinProficiency -leadershipStatus -tourCount -eventCount \
            -gender -hasGraduated -contact -email';
        }

        if(params.hasGraduated){
            filters['hasGraduated'] = params.hasGraduated;
        }
        
        if(params.currentAvailability){
            filters['currentAvailability'] = params.currentAvailability;
        }
    }
    
    Ambassador.find(filters, attributesToIgnore)
        .then(ambassadors => response.status(200).json({
            "code":"SUCCESS",
            "ambassadors":ambassadors}))
        .catch(error => response.status(400).json({
            "code": "INALID_INPUT",
            "message": error}));
});

// GET/ ambassadors/{id}
router.route('/:id').get((request, response) => {
    Ambassador.findById(request.params.id)
        .then(ambassador => response.status(200).json({
            "code":"SUCCESS",
            "ambassador":ambassador}))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error}));
});

// POST/ ambassadors
router.route('/').post((request, response) => {
    //TODO: to confirm details to take note
    const name = request.body.name;
    const primaryDegree = request.body.primaryDegree;
    const secondaryDegree = request.body.secondaryDegree;
    const batch = request.body.batch;
    const nationality = request.body.nationality;
    const race = request.body.race;
    const year = request.body.year;
    const currentAvailability = request.body.currentAvailability;
    const unavailabilityReason = request.body.unavailabilityReason;
    const unavailabilityFrom = request.body.unavailabilityFrom;
    const unavailabilityTo = request.body.unavailabilityTo;
    const mandarinProficiency = request.body.mandarinProficiency;
    const leadershipStatus = request.body.leadershipStatus;
    const hasGraduated = request.body.hasGraduated;
    const gender = request.body.gender;
    const contact = request.body.contact;
    const email = request.body.email;
    const tourCount = {};
    const eventCount = {};
    
    const ambassador = new Ambassador({
        name,
        primaryDegree,
        secondaryDegree,
        batch,
        nationality,
        race,
        year,
        currentAvailability,
        unavailabilityReason,
        unavailabilityFrom,
        unavailabilityTo,
        mandarinProficiency,
        leadershipStatus,
        tourCount,
        eventCount,
        gender,
        hasGraduated,
        contact,
        email,
    });

    ambassador.save()
        .then(()=> response.status(201).json({
            "ambassador": ambassador,
            "code" : "ADDED",
            "message": `Ambassador ${name} has been added successfully.`}))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error}));
});

// PUT/ ambassadors
router.route('/:id').put((request, response) => {
    Ambassador.findById(request.params.id)
        .then(ambassador => {
            ambassador.name = request.body.name;
            ambassador.primaryDegree = request.body.primaryDegree;
            ambassador.secondaryDegree = request.body.secondaryDegree;
            ambassador.batch = request.body.batch;
            ambassador.nationality = request.body.nationality;
            ambassador.race = request.body.race;
            ambassador.year = request.body.year;
            ambassador.currentAvailability = request.body.currentAvailability;
            ambassador.unavailabilityReason = request.body.unavailabilityReason;
            ambassador.unavailabilityFrom = request.body.unavailabilityFrom;
            ambassador.unavailabilityTo = request.body.unavailabilityTo;
            ambassador.mandarinProficiency = request.body.mandarinProficiency;
            ambassador.leadershipStatus = request.body.leadershipStatus;
            ambassador.tourCount = request.body.tourCount;
            ambassador.eventCount = request.body.eventCount;
            ambassador.gender = request.body.gender;
            ambassador.hasGraduated = request.body.hasGraduated;
            ambassador.contact = request.body.contact;
            ambassador.email = request.body.email;
            
            ambassador.save()
                .then(() => response.status(200).json({
                    "ambassador": ambassador,
                    "code": "UPDATED",
                    "message": `Ambassador ${ambassador.name} updated successfully.`}))
                .catch(error => response.status(400).json({
                    "code": "INVALID_INPUT",
                    "message" : error}));
        })
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message:": error}));
});

// DELETE/ ambassadors
router.route('/:id').delete((request, response) => {
    const id = request.params.id
    Ambassador.findByIdAndDelete(id)
        .then(() => response.status(200).json({
            "code": "DELETED",
            "message": `Ambassador ID: ${id} has been deleted.`}))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error}));
});

module.exports = router;