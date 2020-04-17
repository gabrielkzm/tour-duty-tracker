const router = require('express').Router();
let Email = require('../models/email.model');

// POST/ Email
router.route('/').post((request, response) => {
    //TODO: to confirm details to take note
    const to = request.body.to;
    const from = request.body.from;
    const subject = request.body.subject;
    const content = request.body.content;
    const tour = request.body.tour;

    const email = new Email({
        to,
        from,
        subject,
        content,
        tour,
    });

    return response.status(200).json({"email":email, "status":"OK"})
    //TODO: insert api call for sending of emails
});

module.exports = router;