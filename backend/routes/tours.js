const router = require('express').Router();
let Tour = require('../models/tour.model');

// GET/ tours
router.route('/').get((_, response) => {
    Tour.find()
        .then(tours => response.status(200).json({
            "code": "SUCCESS",
            "tours": tours
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

// GET/ tours/1
router.route('/:id').get((request, response) => {
    id = request.params.id
    Tour.findById(id)
        .then(tours => response.status(200).json({
            "code": "SUCCESS",
            "tour": tours
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

// POST/ tours
router.route('/').post((request, response) => {
    name = request.body.name;
    date = request.body.date;
    startTime = request.body.startTime;
    endTime = request.body.endTime;
    type = request.body.type;
    ambassadorAccepted = request.body.ambassadorAccepted;
    ambassadorDeclinedWithReason = request.body.ambassadorDeclinedWithReason;
    ambassadorDeclinedWithoutReason = request.body.ambassadorDeclinedWithoutReason;
    assignedAmbassadors = request.body.assignedAmbassadors;
    ambassadorIC = request.body.ambassadorIC;

    const tour = new Tour({
        name,
        date,
        startTime,
        endTime,
        type,
        ambassadorAccepted,
        ambassadorDeclinedWithReason,
        ambassadorDeclinedWithoutReason,
        assignedAmbassadors,
        ambassadorIC
    });

    tour.save()
        .then(() => response.status(201).json({
            "tour": tour,
            "code": 'ADDED',
            "message": `${name} has been added successfully.`
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

// PUT/ tours/1
router.route('/:id').put((request, response) => {
    Tour.findById(request.params.id)
        .then(tour => {
            tour.name = request.body.name;
            tour.date = request.body.date;
            tour.startTime = request.body.startTime;
            tour.endTime = request.body.endTime;
            tour.type = request.body.type;
            tour.ambassadorAccepted = request.body.ambassadorAccepted;
            tour.ambassadorDeclinedWithReason = request.body.ambassadorDeclinedWithReason;
            tour.ambassadorDeclinedWithoutReason = request.body.ambassadorDeclinedWithoutReason;
            tour.assignedAmbassadors = request.body.assignedAmbassadors;
            tour.ambassadorIC = request.body.ambassadorIC;

            tour.save()
                .then(() => response.status(200).json({
                    "tour": tour,
                    "code": 'UPDATED',
                    "message": `${tour.name} has been updated successfully.`
                }))
                .catch(error => response.status(400).json({
                    "code": "INVALID_INPUT",
                    "message": error
                }));
        })
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

// DELETE/ tours/1
router.route('/:id').delete((request, response) => {
    Tour.findByIdAndDelete(request.params.id)
        .then(() => response.status(200).json({
            "code": "DELETED",
            "message": `Tour has been deleted.`
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

module.exports = router;