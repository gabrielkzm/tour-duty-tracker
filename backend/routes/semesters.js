const router = require('express').Router();
const auth = require('../auth.js');

let Semester = require('../models/semester.model');
//TODO: Put guards for all relevant backend endpoints

// GET/ semesters
router.route('/').get(auth, (_, response) => {
    Semester.find()
        .then(semesters => response.status(200).json({
            "code": "SUCCESS",
            "semesters": semesters
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

// GET/ semesters/1
router.route('/:id').get(auth, (request, response) => {
    let id = request.params.id
    Semester.findById(id)
        .then(semester => response.status(200).json({
            "code": "SUCCESS",
            "semester": semester
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

// POST/ semesters
router.route('/').post(auth, (request, response) => {
    let startDate = request.body.startDate;
    let endDate = request.body.endDate;


    const semester = new Semester({
        startDate,
        endDate
    });

    semester.save()
        .then(() => response.status(201).json({
            "semester": semester,
            "code": 'ADDED',
            "message": `Semester for period: ${startDate} to ${endDate} has been added successfully.`
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

// PUT/ semesters/1
router.route('/:id').put(auth, (request, response) => {
    Semester.findById(request.params.id)
        .then(semester => {
            const startDate = request.body.startDate;
            const endDate = request.body.endDate;
            semester.startDate = startDate;
            semester.endDate = endDate;

            semester.save()
                .then(() => response.status(200).json({
                    "semester": semester,
                    "code": 'UPDATED',
                    "message": `Semester ID: ${semester._id} has been updated successfully.`
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

// DELETE/ semesters/1
router.route('/:id').delete(auth, (request, response) => {
    const id = request.params.id
    Semester.findByIdAndDelete(id)
        .then(() => response.status(200).json({
            "code": "DELETED",
            "message": `Semester ID: ${id} has been deleted.`
        }))
        .catch(error => response.status(400).json({
            "code": "INVALID_INPUT",
            "message": error
        }));
});

module.exports = router;