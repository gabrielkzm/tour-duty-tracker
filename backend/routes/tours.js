const router = require('express').Router();
const auth = require('../auth.js');
let Tour = require('../models/tour.model');
let Ambassador = require('../models/ambassador.model');

// GET/ tours
router.route('/').get(auth, (_, response) => {
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
router.route('/:id').get(auth, (request, response) => {
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
router.route('/').post(auth, (request, response) => {
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
    let requireMandarin = request.body.requireMandarin;
    let announcedDate = null;

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
        requireMandarin,
        announcedDate,
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
router.route('/:id').put(auth, (request, response) => {
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
            tour.requireMandarin = request.body.requireMandarin;
            tour.announcedDate = request.body.announcedDate;

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

//
// PUT/ tours/replyTour/reject (public)
router.route('/replyTour/reject').put(async (request, response) => {
    try{
        const declineReasons = ['Class', 'Appointment', 'Meeting', 'Overseas', 'Emergency', 'Upcoming LOA or Exchange', 'Unable to speak Mandarin (Applicable only for tour hosted in Mandarin)'];
        const mandarinDeclineReason = 'Unable to speak Mandarin (Applicable only for tour hosted in Mandarin)';
        const declineReason = request.body.declineReason
        const ambassadorName = request.body.name
        const pin = request.body.pin
        const tourID = request.body.tourID

        const ambassador = await Ambassador.findOne({name: ambassadorName})
        

        if(!declineReasons.includes(declineReason)){
            throw new Error('No reason given for rejecting tour. Please select a valid reason for rejecting tour.')
        }
        
        if(!ambassador){
            throw new Error('Invalid ambassador name. Please contact Tours Portfolio Head/Executive');
        }
        
        const ambassadorID = ambassador._id.toString()
        if(ambassadorID.substr(ambassadorID.length - 4) !== pin){
            throw new Error('Invalid PIN entered, please try again.');
        }

        Tour.findById(tourID)
            .then(tour => {
                if(!tour.requireMandarin && declineReason === mandarinDeclineReason){
                    throw new Error('Invalid reason given. This reason is only valid for tours hosted in Mandarin. Please select a valid reason for declining tour.')
                }

                let index = tour.ambassadorsAccepted.indexOf(ambassadorID)
                if(index != -1){
                    tour.ambassadorsAccepted.splice(index, 1)
                }

                if(!tour.ambassadorsDeclinedWithReason.includes(ambassadorID)){
                    tour.ambassadorsDeclinedWithReason.push(ambassadorID)
                }

                tour.save()
                .then(() => response.status(200).json({
                    "code": 'UPDATED',
                    "message": `${ambassadorName}, your reply has been recorded. RSVP: Rejected - valid reason.`
                }))
                .catch(() => response.status(500).json({
                    "code": "INTERNAL_ERROR",
                    "message": 'Something went wrong. Please contact Tours Portfolio Head/Executive.'
                }));
            })
            .catch(() => response.status(400).json({
                "code": "INVALID_INPUT",
                "message": 'Tour ID is invalid. Please contact Tours Portfolio Head/Executive.'
            }))
    }catch(error){
        console.log(error)
        response.status(400).json({
            "code": 'INVALID_INPUT',
            "message": `${error.message}`
        })
    }
});

// PUT/ tours/replyTour/accept (public)
router.route('/replyTour/accept').put(async (request, response) => {
    try{
        const ambassadorName = request.body.name
        const pin = request.body.pin
        const tourID = request.body.tourID

        const ambassador = await Ambassador.findOne({name: ambassadorName})
        
        if(!ambassador){
            throw new Error('Invalid ambassador name. Please contact Tours Portfolio Head/Executive.');
        }
        
        const ambassadorID = ambassador._id.toString()
        
        if(ambassadorID.substr(ambassadorID.length - 4) !== pin){
            throw new Error('Invalid PIN entered, please try again.');
        }

        Tour.findById(tourID)
            .then(tour => {

                let index = tour.ambassadorsDeclinedWithReason.indexOf(ambassadorID)
                if(index != -1){
                    tour.ambassadorsDeclinedWithReason.splice(index, 1)
                }

                if(!tour.ambassadorsAccepted.includes(ambassadorID)){
                    tour.ambassadorsAccepted.push(ambassadorID)
                }

                tour.save()
                .then(() => response.status(200).json({
                    "code": 'UPDATED',
                    "message": `${ambassadorName}, your reply has been recorded. RSVP: Accepted.`
                }))
                .catch(() => response.status(500).json({
                    "code": "INTERNAL_ERROR",
                    "message": 'Something went wrong. Please contact Tours Portfolio Head/Executive.'
                }));
            })
            .catch(() => response.status(400).json({
                "code": "INVALID_INPUT",
                "message": 'Tour ID is invalid. Please contact Tours Portfolio Head/Executive.'
            }))
    }catch(error){
        console.log(error)
        response.status(400).json({
            "code": 'INVALID_INPUT',
            "message": `${error.message}`
        })
    }
});

// DELETE/ tours/1
router.route('/:id').delete(auth, (request, response) => {
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