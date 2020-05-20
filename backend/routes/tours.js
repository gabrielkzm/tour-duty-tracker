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
    let id = request.params.id
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
    let name = request.body.name;
    let date = request.body.date;
    let startTime = date + 'T' + request.body.startTime + ':00Z';
    let endTime = date + 'T' + request.body.endTime + ':00Z';
    let type = request.body.type;
    let ambassadorsAccepted = request.body.ambassadorsAccepted;
    let ambassadorsDeclinedWithReason = request.body.ambassadorsDeclinedWithReason;
    let ambassadorsDeclinedWithoutReason = request.body.ambassadorsDeclinedWithoutReason;
    let assignedAmbassadors = request.body.assignedAmbassadors;
    let ambassadorIC = request.body.ambassadorIC;
    let numberOfAmbassadorsRequired = request.body.numberOfAmbassadorsRequired;
    let numberOfGuests = request.body.numberOfGuests;
    let attire = request.body.attire;
    let purposeOfTour = request.body.purposeOfTour;
    let guestProfile = request.body.guestProfile;
    let checkPoints = request.body.checkPoints;
    let startPoint = request.body.startPoint;
    let endPoint = request.body.endPoint;
    let remarks = request.body.remarks;
    let office = request.body.office;
    let officePhoneContact = request.body.officePhoneContact;
    let officeEmailContact = request.body.officeEmailContact;
    let officeLiaison = request.body.officeLiaison;
    let status = request.body.status;
    let urgentTour = request.body.urgentTour;

    const tour = new Tour({
        name,
        date,
        startTime,
        endTime,
        type,
        numberOfGuests,
        numberOfAmbassadorsRequired,
        ambassadorsAccepted,
        ambassadorsDeclinedWithReason,
        ambassadorsDeclinedWithoutReason,
        assignedAmbassadors,
        ambassadorIC,
        attire,
        purposeOfTour,
        guestProfile,
        checkPoints,
        startPoint,
        endPoint,
        remarks,
        office,
        officePhoneContact,
        officeEmailContact,
        officeLiaison,
        status,
        urgentTour,
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
            let date = request.body.date;
            tour.date = date
            tour.startTime = date + 'T' + request.body.startTime + ':00Z';
            tour.endTime = date + 'T' + request.body.endTime + ':00Z';
            tour.type = request.body.type;
            tour.numberOfGuests = request.body.numberOfGuests;
            tour.numberOfAmbassadorsRequired = request.body.numberOfAmbassadorsRequired;
            tour.ambassadorsAccepted = request.body.ambassadorsAccepted;
            tour.ambassadorsDeclinedWithReason = request.body.ambassadorsDeclinedWithReason;
            tour.ambassadorsDeclinedWithoutReason = request.body.ambassadorsDeclinedWithoutReason;
            tour.assignedAmbassadors = request.body.assignedAmbassadors;
            tour.ambassadorIC = request.body.ambassadorIC;
            tour.attire = request.body.attire;
            tour.purposeOfTour = request.body.purposeOfTour;
            tour.guestProfile = request.body.guestProfile;
            tour.checkPoints = request.body.checkPoints;
            tour.startPoint = request.body.startPoint;
            tour.endPoint = request.body.endPoint;
            tour.remarks = request.body.remarks;
            tour.office = request.body.office;
            tour.officePhoneContact = request.body.officePhoneContact;
            tour.officeEmailContact = request.body.officeEmailContact;
            tour.officeLiaison = request.body.officeLiaison;
            tour.status = request.body.status;
            tour.urgentTour = request.body.urgentTour;

            tour.save()
                .then(() => response.status(200).json({
                    "tour": tour,
                    "code": 'UPDATED',
                    "message": `Tour: ${tour.name} has been updated successfully.`
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
    const id = request.params.id
    Tour.findByIdAndDelete(id)
        .then(() => response.status(200).json({
            "code": "DELETED",
            "message": `Tour ID: ${id} has been deleted.`
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

module.exports = router;