const router = require('express').Router();
// let Ambassador = require('../models/ambassador.model');

// // GET/ ambassadors
// router.route('/').get((_, response) => {
//     Ambassador.find()
//         .then(ambassadors => response.status(200).json(ambassadors))
//         .catch(error => response.status(400).json(`Error: ${error}`));
// });

// // GET/ ambassadors/{id}
// router.route('/:id').get((request, response) => {
//     Ambassador.findById(request.params.id)
//         .then(ambassador => response.status(200).json(ambassador))
//         .catch(error => response.status(400).json(`Error: ${error}`));
// });

// // POST/ ambassadors
// router.route('/').post((request, response) => {
//     //TODO: to confirm details to take note
//     const firstName = request.body.first_name;
//     const lastName = request.body.last_name;
//     const primaryDegree = request.body.primary_degree;
//     const secondaryDegree = request.body.secondary_degree;
//     const batch = request.body.batch;
//     const nationality = request.body.nationality;
//     const race = request.body.race;
//     const year = request.body.year;
//     const isAvailable = request.body.is_available;
//     const unavailabilityReason = request.body.unavailability_reason;
//     const unavailableFrom = request.body.unavailable_from;
//     const unavailableTo = request.body.unavailable_to;
//     const isChineseProficient = request.body.chinese_proficient;
//     const hasClearedLeadership = request.body.has_cleared_leadership;
//     const tourCount = 0;
//     const events = 0;

//     const ambassador = new Ambassador({
//         firstName,
//         lastName,
//         primaryDegree,
//         secondaryDegree,
//         batch,
//         nationality,
//         race,
//         year,
//         isAvailable,
//         unavailabilityReason,
//         unavailableFrom,
//         unavailableTo,
//         isChineseProficient,
//         hasClearedLeadership,
//         tourCount,
//         events
//     });

//     ambassador.save()
//         .then(()=> response.status(201).json(`Ambassador ${firstName} ${lastName} added successfully.`))
//         .catch(error => response.status(400).json(`Error: ${error}`));
// });

// // PUT/ ambassadors
// router.route('/').put((request, response) => {
//     Ambassador.findById(request.params.id)
//         .then(ambassador => {
//             ambassador.firstName = request.body.first_name;
//             ambassador.lastName = request.body.last_name;
//             ambassador.primaryDegree = request.body.primary_degree;
//             ambassador.secondaryDegree = request.body.secondary_degree;
//             ambassador.batch = request.body.batch;
//             ambassador.nationality = request.body.nationality;
//             ambassador.race = request.body.race;
//             ambassador.year = request.body.year;
//             ambassador.isAvailable = request.body.is_available;
//             ambassador.unavailabilityReason = request.body.unavailability_reason;
//             ambassador.unavailableFrom = request.body.unavailable_from;
//             ambassador.unavailableTo = request.body.unavailable_to;
//             ambassador.isChineseProficient = request.body.chinese_proficient;
//             ambassador.hasClearedLeadership = request.body.has_cleared_leadership;
//             ambassador.tourCount = 0;
//             ambassador.events = 0;
//             //TODO: check if there is proper status code for update
//             ambassador.save()
//                 .then(() => response.status(200).json(`Ambassador ${firstName} ${lastName} updated successfully.`))
//                 .catch(error => response.status(400).json(`Error: ${error}`));
//         })
//         .catch(error => response.status(400).json(`Error: ${error}`));
// });

// // DELETE/ ambassadors
// router.route('/:id').delete((request, response) => {
//     firstName = request.body.first_name;
//     lastName = request.body.last_name;
//     Ambassador.findByIdAndDelete(request.params.id)
//         .then(() => response.status(200).json(`Ambassador ${firstName} ${lastName} has been deleted.`))
//         .catch(error => response.status(400).json(`Error: ${error}`));
// });

module.exports = router;