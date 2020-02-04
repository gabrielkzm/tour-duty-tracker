const router = require('express').Router();
let Tour = require('../models/tour.model');

// GET/ tours
router.route('/').get((_, response) => {
    Tour.find()
        .then(tours => response.status(200).json(tours))
        .catch(error => response.status(400).json(`Error: ${error}`));
});

// GET/ tours/1
router.route('/:id').get((request, response) => {
    id = request.params.id
    Tour.findById(id)
        .then(tours => response.status(200).json(tours))
        .catch(error => response.status(400).json(error));
});

// POST/ tours
router.route('/').post((request, response) => {
    name = request.body.name;
    date = request.body.date;
    startTime = request.body.start_time;
    endTime = request.body.end_time;
    type = request.body.type;
    ambassadorAcceptance = request.body.ambassador_accepted_replies;
    ambassadorDeclined = request.body.ambassador_declined_replies
    assignedAmbassadors = request.body.assigned_ambassadors;
    ambassadorIC = request.body.ambassador_ic;
    //TODO: update creation date, update date based on current date time.now()
    const createdOn = request.body.created_on;
    const updatedOn = createdOn;

    const tour = new Tour({
        name,
        date,
        startTime,
        endTime,
        type,
        ambassadorAcceptance,
        ambassadorDeclined,
        assignedAmbassadors,
        ambassadorIC
    });

    tour.save()
        .then(() => response.status(201).json(`Tour: ${name} has been added successfully.`))
        .catch(error => response.status(400).json(`Error: ${error}`));
});

// PUT/ tours/1
// DELETE/ tours/1
router.route('/:id').delete((request, response) => {
    
});
