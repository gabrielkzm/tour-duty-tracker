const router = require('express').Router();
const sendgrid = require('@sendgrid/mail');
const auth = require('../auth.js');
sendgrid.setApiKey(process.env.EMAIL_API_KEY);

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// POST/ Email
router.route('/').post(auth, async (request, response) => {
    const emailType = request.body.emailType;
    const ambassadorEmailRecipients = request.body.ambassadorEmailRecipients;
    let officeEmailRecipients = request.body.officeEmailRecipients;
    const systemEmail = process.env.EMAIL_SENDER;
    const assignedAmbassadors = request.body.assignedAmbassadors;
    const ambassadorIC = request.body.ambassadorIC;
    const senderName = request.body.senderName;
    const senderContact = request.body.senderContact;
    const senderEmail = request.body.senderEmail;
    const tour = request.body.tour;
    const responseURL = request.body.responseURL;

    let tourDate = new Date(tour.date)
    let tourDateString = tourDate.toDateString()
    let tourDateText = tourDateString.substr(tourDateString.indexOf(' ') + 1);

    let deadlineDate = new Date()
    deadlineDate.setDate(deadlineDate.getDate() + 2);
    let deadlineDateString = deadlineDate.toDateString()
    let deadlineDateText = deadlineDateString.substr(deadlineDateString.indexOf(' ') + 1);

    officeEmailRecipients = [...new Set(officeEmailRecipients)];
    //TODO: delete email model
    try {
        if (emailType === "initialEmail") {
            const ambassadorTemplateID = process.env.EMAIL_INITIAL_AMBASSADORS_TID;
        
            let messageToAmbassador = {
                to: ambassadorEmailRecipients,
                from: systemEmail,
                dynamic_template_data: {
                    "tourName": tour.name,
                    "office": tour.office,
                    "purposes": tour.purposeOfTour,
                    "numberOfGuests": tour.numberOfGuests,
                    "numberOfAmbassadorsRequired": tour.numberOfAmbassadorsRequired,
                    "tourDay": days[tourDate.getDay()],
                    "tourDate": tourDateText,
                    "startTime": tour.startTime,
                    "endTime": tour.endTime,
                    "deadlineDay": days[deadlineDate.getDay()],
                    "deadlineDate": deadlineDateText,
                    "sender": senderName,
                    "senderEmail": senderEmail,
                    "senderContact": senderContact,
                    "responseURL": responseURL
                },
                template_id: ambassadorTemplateID
            }

            await sendgrid.send(messageToAmbassador);

            const officeTemplateID = process.env.EMAIL_INITIAL_OFFICE_TID
            
            let messageToOffice = {
                to: officeEmailRecipients,
                from: systemEmail,
                template_id: officeTemplateID,
                dynamic_template_data: {
                    "tourName": tour.name,
                    "officeLiaison": tour.officeLiaison,
                    "sender": senderName,
                    "senderEmail": senderEmail,
                    "senderContact": senderContact,
                }
            }

            await sendgrid.send(messageToOffice);

            return response.status(200).json({ "message": "Initial email to Ambassadors and Office sent", "code": "SUCCESS" })
        } else if (emailType === "confirmationEmail") {
            const ambassadorTemplateID = process.env.EMAIL_CONFIRMATION_AMBASSADORS_TID;
            let messageToAmbassador = {
                to: ambassadorEmailRecipients,
                from: systemEmail,
                dynamic_template_data: {
                    "tourName": tour.name,
                    "ambassadorsAssigned": assignedAmbassadors,
                    "ambassadorIC": ambassadorIC,
                    "sender": senderName,
                    "senderEmail": senderEmail,
                    "senderContact": senderContact,
                },
                template_id: ambassadorTemplateID
            }

            await sendgrid.send(messageToAmbassador)
        
            const officeTemplateID = process.env.EMAIL_CONFIRMATION_OFFICE_TID;
            let messageToOffice = {
                to: officeEmailRecipients,
                from: systemEmail,
                template_id: officeTemplateID,
                dynamic_template_data: {
                    "tourName": tour.name,
                    "officeLiaison": tour.officeLiaison,
                    "sender": senderName,
                    "senderEmail": senderEmail,
                    "senderContact": senderContact,
                    "ambassadorsAssigned": assignedAmbassadors,
                    "ambassadorIC": ambassadorIC,
                    "date": tourDateText,
                    "startTime": tour.startTime,
                    "endTime": tour.endTime,
                    "attire": tour.attire,
                    "numberOfGuests": tour.numberOfGuests,
                    "purposeOfTour": tour.purposeOfTour.join(', '),
                    "checkPoints": tour.checkPoints,
                    "startPoint": tour.startPoint,
                    "endPoint": tour.endPoint,
                    "office": tour.office,
                    "officeEmailContact": tour.officeEmailContact,
                    "officePhoneContact": tour.officePhoneContact
                }
            }

            await sendgrid.send(messageToOffice)

            return response.status(200).json({ "message": "Confirmation email to Ambassadors and Office sent.", "code": "SUCCESS" })
        } else {
            return response.status(400).json({ "message": "Invalid email type. Please try one of the following: initialEmail or confirmationEmail", "code": "INVALID_INPUT" })
        }
    } catch (error) {
        let message = error.response.body.errors ? error.response.body.errors : "Something went wrong. Please contact Tours Portfolio Head/EXCO/Platform Administrator."
        return response.status(500).json({ "message": message, "code": "INTERNAL_ERROR" })
    }
});

module.exports = router;