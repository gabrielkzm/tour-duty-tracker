const router = require('express').Router();
let Semester = require('../models/semester.model')
let Tour = require('../models/tour.model')
let Ambassador = require('../models/ambassador.model')
// GET/ statistics
router.route('/:date').get(async (request, response) => {
    try{
        let statistics = {}
        
        const date = request.params.date
        const today = date ? date : new Date()
        //
        const semester = await Semester.findOne({
            startDate: {
                $lte: today,
            },
            endDate: {
                $gte: today
            }
        }); 
        if(!semester){
            throw new Error('Invalid Semester. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }
        const semesterID = semester._id.toString()
        statistics["startDate"] = semester.startDate.toISOString().substr(0,10)
        statistics["endDate"] = semester.endDate.toISOString().substr(0,10)
        //

        let tourCountSortObj = {}
        const tourCountSortAttribute = 'tourCount.' + semesterID
        tourCountSortObj[tourCountSortAttribute] = -1;

        const tourKing = await Ambassador.find({
            hasGraduated: false,
            gender: 'M',
        }).sort(tourCountSortObj)

        if(!tourKing){
            throw new Error('Tour King selection error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        if(tourKing.length > 0){
            let tourKingList = [{"name":tourKing[0]['name'], "count": tourKing[0]['tourCount'].get(semesterID)}]
            for(let i = 1; i< tourKing.length; i++){
                let king = tourKing[i];
                if (king['tourCount'].get(semesterID) >= tourKing[i-1]['tourCount'].get(semesterID)){
                    tourKingList.push({"name":king['name'], "count": king['tourCount'].get(semesterID)})
                }else{
                    break;
                }
            }
            statistics['tourKing'] = tourKingList
        }else{
            statistics['tourKing'] = []
        }
    
        const tourQueen = await Ambassador.find({
            hasGraduated: false,
            gender: 'F',
        }).sort(tourCountSortObj)

        if(!tourQueen){
            throw new Error('Tour Queen selection error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }

        if(tourQueen.length > 0){
            let tourQueenList = [{"name":tourQueen[0]['name'], "count": tourQueen[0]['tourCount'].get(semesterID)}]
            for(let i = 1; i< tourQueen.length; i++){
                let queen = tourQueen[i];
                if (queen['tourCount'].get(semesterID) >= tourQueen[i-1]['tourCount'].get(semesterID)){
                    tourQueenList.push({"name":queen['name'], "count": queen['tourCount'].get(semesterID)})
                }else{
                    break;
                }
            }
            statistics['tourQueen'] = tourQueenList
        }else{
            statistics['tourQueen'] = []
        }
        
        //
        const ambassadorAvailableCount = await Ambassador.countDocuments({
            hasGraduated: false,
            currentAvailability: true
        })
        const ambassadorCount = await Ambassador.countDocuments({
            hasGraduated: false,
        })
        if(ambassadorCount == null || ambassadorAvailableCount == null){
            throw new Error('Active Ambassador Count error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }
        statistics['ambassadorAvailableCount'] = ambassadorAvailableCount
        statistics['ambassadorCount'] = ambassadorCount
        //TODO: make a note to say that this only reflect latest info

        //
        const mandarinTourCount = await Tour.countDocuments({
            requireMandarin: true,
            date: {
                $gte: statistics['startDate'],
                $lte: statistics['endDate'] 
            }
        })
        const tourCount = await Tour.countDocuments({
            date: {
                $gte: statistics['startDate'],
                $lte: statistics['endDate'] 
            }
        })
        if(mandarinTourCount == null || tourCount == null){
            throw new Error('Mandarin Tour Count error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }
        statistics['tourCount'] = tourCount
        statistics['mandarinTourCount'] = mandarinTourCount
        statistics['nonMandarinTourCount'] = tourCount - mandarinTourCount
        //

        //
        const toursGroupByOfficeCount = await Tour.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(statistics['startDate']),
                        $lte: new Date(statistics['endDate'])
                    }
                }
            },
            {
                $group: {_id:"$office", count:{$sum:1}}
            }
        ])
        if(!toursGroupByOfficeCount){
            throw new Error('Tour Group by Office Count error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }
        statistics['toursGroupByOfficeCount'] = toursGroupByOfficeCount
        //

        //
        const toursGroupByYearCount = await Tour.aggregate([
            {
                $group: {
                    _id: {
                        $year: "$date"
                    },
                    count: {$sum: 1}
                }
            }
        ])
        if(!toursGroupByYearCount){
            throw new Error('Tour Group by Year Count error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }
        statistics['toursGroupByYearCount'] = toursGroupByYearCount
        //TODO: make a note that this will always show a time series

        //
        const toursGroupByPurposeCount = await Tour.aggregate([
            {
                $unwind: "$purposeOfTour"
            },
            {
                $match: {
                    date: {
                        $gte: new Date(statistics['startDate']),
                        $lte: new Date(statistics['endDate'])
                    }
                }
            },
            {
                $group: {_id:"$purposeOfTour", count:{$sum:1}}
            }
        ])
        if(!toursGroupByPurposeCount){
            throw new Error('Tour Group by Purpose Count error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }
        statistics['toursGroupByPurposeCount'] = toursGroupByPurposeCount
        //

        //
        const tours = await Tour.find({
            date: {
                $gte: new Date(statistics['startDate']),
                $lte: new Date(statistics['endDate'])
            }
        }, '-createdAt -updatedAt -__v -numberOfGuests -numberOfAmbassadorsRequired \
            -ambassadorsDeclinedWithReason -ambassadorsAccepted -attire -purposeOfTour -guestProfile \
            -checkPoints -startPoint -endPoint -remarks -office -officePhoneContact -officeEmailContact \
            -officeLiaison -requireMandarin -_id -ambassadorIC -urgentTour')
        
        const ambassadors = await Ambassador.find({}, '-__v -createdAt -updatedAt -primaryDegree \
            -secondaryDegree -batch -nationality -race -year \
            -unavailabilityReason -unavailabilityFrom -unavailabilityTo \
            -mandarinProficiency -leadershipStatus \
            -gender -hasGraduated -contact -email')

        if(!tours || !ambassadors){
            throw new Error('Tour Evaluations error. Please try again or contact Tours Portfolio Head/EXCO/Platform Administrator.');
        }


        let tourEvaluations = {}
        ambassadors.map(ambassador => {
            tourEvaluations[ambassador._id] = {
                "name": ambassador["name"],
                "currentAvailability": ambassador["currentAvailability"],
                "toursConducted": [],
                "tourDeductions": [],
                "UEHours": ambassador['eventCount'].get(semesterID) ? ambassador['eventCount'].get(semesterID): 0,
                "tourCount": ambassador["tourCount"].get(semesterID) ? ambassador["tourCount"].get(semesterID): 0,
                "tourPoints": 0,
                "replyPoints": 5,
                "pass": null,
                "finalPoints": 0,
            }
        })

        tours.map(tour => {
            tour.assignedAmbassadors.forEach((id, _) => {
                if(tourEvaluations[id] == null){
                    return
                }else{
                    if(tour["type"] === "TOUR"){
                        tourEvaluations[id]['toursConducted'].push(tour["name"])
                    }else{
                        const endTime = new Date(tour.endTime);
                        const startTime = new Date(tour.startTime);
                        const hours = (endTime.getMinutes() - startTime.getMinutes()) / 60
                        tourEvaluations[id]['UEHours'] = tourEvaluations[id]['UEHours'] + hours
                    }
                }
            })

            tour.ambassadorsDeclinedWithoutReason.forEach((id, _) => {
                if(tourEvaluations[id] == null){
                    return
                }else{
                    tourEvaluations[id]['tourDeductions'].push(tour["name"])
                }
            })
        })

        tourEvaluations = tabulatePoints(tourEvaluations)
        statistics['tourEvaluations'] = tourEvaluations

        response.status(200).json({
            "code": "SUCCESS",
            "message": "Success",
            "statistics": statistics
        })

    }catch(error){
        console.log(error);
        const message = error.message ? error.message : error
        response.status(400).json({
            "code": "INVALID_INPUT",
            "message": message
        })
    }
});

function tabulatePoints(tourEvaluations){
    for(const [key, ambassador] of Object.entries(tourEvaluations)){
        if(ambassador['tourCount'] >= 4){
            //TODO: Discrepancy for tour evaluation and ue hours, check with EXCO. (UE not factored in yet)
            ambassador['tourPoints'] = Math.min(7.5, ambassador['tourCount'])
        }else{
            ambassador['tourPoints'] = ambassador['tourCount']
        }
        
        let deductions = ambassador['tourDeductions'].length / 2;
        ambassador['replyPoints'] -= deductions
        ambassador['finalPoints'] = ambassador['tourPoints'] + ambassador['replyPoints']
        if(ambassador['finalPoints'] >= 12.5){
            ambassador['pass'] = true
        }else{
            ambassador['pass'] = false
        }
    }

    return tourEvaluations
}
module.exports = router;