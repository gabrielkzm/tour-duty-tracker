const router = require('express').Router();
const auth = require('../auth.js');
let Tour = require('../models/tour.model');
let Semester = require('../models/semester.model');
let Ambassador = require('../models/ambassador.model');

// POST/ assignments
// Include tabulation of scores
router.route('/').post(auth, async (request, response) => {
    const assignAutomatically = request.body.assignAutomatically
    const tourID = request.body.tourID;
    const selectedAmbassadors = request.body.selectedAmbassadors;
    const ambassdorsHaveNotResponded = request.body.ambassdorsHaveNotResponded;
    
    try {
        const tour = await Tour.findById(tourID)
        if (!tour) {
            throw new Error('Invalid Tour. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        const isUrgent = tour.urgentTour
        const endTime = new Date(tour.endTime);
        const startTime = new Date(tour.startTime);
        const hours = (endTime.getMinutes() - startTime.getMinutes()) / 60

        const semester = await Semester.findOne({
            startDate: {
                $lte: tour.date,
            },
            endDate: {
                $gte: tour.date
            }
        });
        if (!semester) {
            throw new Error('Invalid Semester. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        const semesterID = semester._id.toString();
        
        let newAssignedAmbassadors = null;
        if (tour.type === 'TOUR') {
            newAssignedAmbassadors = assignAutomatically ? await addTourPointsAutoAssignment(semesterID, tour) : await addTourPointsManualAssignment(semesterID, tour, selectedAmbassadors)
            if (!newAssignedAmbassadors) {
                throw new Error('Failed to assign ambassadors for Tour. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
            }
        } else {
            newAssignedAmbassadors = assignAutomatically ? await addUEHoursAutoAssignment(semesterID, tour, hours): await addUEHoursManualAssignment(semesterID, tour, hours, selectedAmbassadors)
            if (!newAssignedAmbassadors) {
                throw new Error('Failed to assign ambassadors for UE. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
            }
        }

        let deducted = deductTourPointsOrUEHours(semesterID, tour, newAssignedAmbassadors, hours)
        if (!deducted) {
            throw new Error('Failed to deduct points for Tour/UE. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        if(!isUrgent){
            tour.ambassadorsDeclinedWithoutReason = tour.ambassadorsDeclinedWithoutReason.concat(ambassdorsHaveNotResponded);
        }

        tour.assignedAmbassadors = newAssignedAmbassadors;
        tour.ambassadorIC = newAssignedAmbassadors[0];
        tour.status = "Assigned"
        await tour.save();
        response.status(200).json({
            "code": "SUCCESS",
            "message": `Tour: ${tour.name} has been assigned.`,
            "tour": tour
        })
    } catch (error) {
        console.log(error);
        response.status(400).json({
            "code": "INVALID_INPUT",
            "message": "Please contact Tours Portfolio Head/EXCO/Platform Administrator."
        })
    }
});

async function addUEHoursManualAssignment(semesterID, tour, hours, selectedAmbassadors) {
    const oldAssignedAmbassadors = tour.assignedAmbassadors;

    try {
        let ambassadors = await Ambassador.find({
            _id: {
                $in: selectedAmbassadors
            },
        });

        if (!ambassadors) {
            throw new Error('Invalid Ambassadors. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        let newAssignedAmbassadors = []
        ambassadors = ambassadors.map(ambassador => {
            if (ambassador.eventCount.get(semesterID) == null) {
                ambassador.eventCount.set(semesterID, 0);
            }

            newAssignedAmbassadors.push(ambassador._id.toString())
            if (!oldAssignedAmbassadors.includes(ambassador._id.toString())) {
                let eventCount = ambassador.eventCount;
                eventCount.set(semesterID, eventCount.get(semesterID) + hours);
                ambassador.eventCount = eventCount;
                try {
                    ambassador.save();
                } catch (error) {
                    console.log(error);
                }
            }
            
            return ambassador;
        })
        return newAssignedAmbassadors
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function addTourPointsManualAssignment(semesterID, tour, selectedAmbassadors) {
    const oldAssignedAmbassadors = tour.assignedAmbassadors;
    
    try {
        let ambassadors = await Ambassador.find({
            _id: {
                $in: selectedAmbassadors
            },
        });

        if (!ambassadors) {
            throw new Error('Invalid Ambassadors. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        let newAssignedAmbassadors = []
        ambassadors = ambassadors.map(ambassador => {
            if (ambassador.tourCount.get(semesterID) == null) {
                ambassador.tourCount.set(semesterID, 0);
            }

            newAssignedAmbassadors.push(ambassador._id.toString())
            if (!oldAssignedAmbassadors.includes(ambassador._id.toString())) {
                let tourCount = ambassador.tourCount;
                tourCount.set(semesterID, tourCount.get(semesterID) + 1);
                ambassador.tourCount = tourCount;
                try {
                    ambassador.save();
                } catch (error) {
                    console.log(error);
                }
            }
            
            return ambassador;
        })
        return newAssignedAmbassadors
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function addUEHoursAutoAssignment(semesterID, tour, hours) {
    const ambassadorsAccepted = tour.ambassadorsAccepted;
    const numberOfAmbassadorsRequired = tour.numberOfAmbassadorsRequired;
    const oldAssignedAmbassadors = tour.assignedAmbassadors;

    try {
        let ambassadors = await Ambassador.find({
            _id: {
                $in: ambassadorsAccepted
            },
        });

        if (!ambassadors) {
            throw new Error('Invalid Ambassadors. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        ambassadors = ambassadors.map(ambassador => {
            let eventCount = ambassador.eventCount;
            if (eventCount.get(semesterID) == null) {
                eventCount.set(semesterID, 0);
            }
            return ambassador;
        })

        ambassadors.sort((a, b) => a.eventCount.get(semesterID) - b.eventCount.get(semesterID));
        let newAssignedAmbassadors = []
        for (let i = 0; i < numberOfAmbassadorsRequired; i++) {
            let ambassador = ambassadors[i];
            newAssignedAmbassadors.push(ambassador._id.toString())
            if (oldAssignedAmbassadors.includes(ambassador._id.toString())) {
                continue;
            }
            let eventCount = ambassador.eventCount;
            eventCount.set(semesterID, eventCount.get(semesterID) + hours);
            ambassador.eventCount = eventCount;
            try {
                ambassador.save();
            } catch (error) {
                console.log(error);
            }
        }
        return newAssignedAmbassadors
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function addTourPointsAutoAssignment(semesterID, tour) {
    const ambassadorsAccepted = tour.ambassadorsAccepted;
    const numberOfAmbassadorsRequired = tour.numberOfAmbassadorsRequired;
    const oldAssignedAmbassadors = tour.assignedAmbassadors;
    try {
        let ambassadors = await Ambassador.find({
            _id: {
                $in: ambassadorsAccepted
            },
        });

        if (!ambassadors) {
            throw new Error('Invalid Ambassadors. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        ambassadors = ambassadors.map(ambassador => {
            let tourCount = ambassador.tourCount;
            if (tourCount.get(semesterID) == null) {
                tourCount.set(semesterID, 0);
            }
            return ambassador;
        })

        ambassadors.sort((a, b) => a.tourCount.get(semesterID) - b.tourCount.get(semesterID));
        let newAssignedAmbassadors = []
        for (let i = 0; i < numberOfAmbassadorsRequired; i++) {
            let ambassador = ambassadors[i];
            newAssignedAmbassadors.push(ambassador._id.toString())
            if (oldAssignedAmbassadors.includes(ambassador._id.toString())) {
                continue;
            }
            let tourCount = ambassador.tourCount;
            tourCount.set(semesterID, tourCount.get(semesterID) + 1);
            ambassador.tourCount = tourCount;
            try {
                ambassador.save();
            } catch (error) {
                console.log(error);
            }
        }
        return newAssignedAmbassadors
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function deductTourPointsOrUEHours(semesterID, tour, newAssignedAmbassadors, hours) {
    const previouslyAssignedAmbassadors = tour.assignedAmbassadors;
    try {
        let ambassadors = await Ambassador.find({
            _id: {
                $in: previouslyAssignedAmbassadors
            },
        })

        if (!ambassadors) {
            throw new Error('Invalid Ambassadors. Please contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        ambassadors.map(ambassador => {
            if (!newAssignedAmbassadors.includes(ambassador._id.toString())) {
                if(tour.type === "TOUR"){
                    ambassador.tourCount.set(semesterID, ambassador.tourCount.get(semesterID) - 1);
                }else{
                    ambassador.eventCount.set(semesterID, ambassador.eventCount.get(semesterID) - hours);
                }
                
                try {
                    ambassador.save();
                } catch (error) {
                    console.log(error);
                }
            }
            return ambassador;
        })
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = router;