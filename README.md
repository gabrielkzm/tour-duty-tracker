# IRA, the Tour Duty Tracker

IRA, a tour duty tracker, is a web based system built on MongoDB, Express, Node.js, Vue.js and hosted on Heroku. IRA comprise a range of functionalities that support the job/duty (tours) allocations, which is common in many organisations. Some key features include:

- Centralisation and storage of demographic information of stakeholders
- Job/Duty (Tour) assignment based on criteria (can be revised based on needs)
- Visaulisation dashboard that provides actionable insights
- Duty score tabulation and evaluation (can be revised based on needs)

This project serves as a learning platform for me pertaining to the MEVN stack. It is **not** meant for production purposes, and may **not** include every best practice in the industry.

Should you wish to find out more, please contact me at my [email](gabrielkoh@live.com) or via [LinkedIn](https://www.linkedin.com/in/gabrielkzm/).

## Pre-requisites (.env)
- Mongo Atlas account with a configured database cluster and credentials `ATLAS_URI`
- Default port `PORT`
- Admin PIN `PIN`
- JWT KEY `JWT_KEY`
- SendGrid account and relevant keys `EMAIL_API_KEY, EMAIL_SENDER, EMAIL_INITIAL_AMBASSADORS_TID, EMAIL_INITIAL_OFFICE_TID, EMAIL_CONFIRMATION_AMBASSADORS_TID, EMAIL_CONFIRMATION_OFFICE_TID, EMAIL_INITIAL_AMBASSADORS_MANDARIN_URGENT_TID, EMAIL_INITIAL_AMBASSADORS_MANDARIN_TID, EMAIL_INITIAL_AMBASSADORS_URGENT_TID, EMAIL_INITIAL_OFFICE_URGENT_TID, `
- Environment `NODE_ENV`
- Setup for Express, React, Node.js, Heroku

## Getting Started (Local)

In order to start the application, please follow the subsequent steps (Ensure .env file has been created and filled up):

1. cd into project root folder and backend folder respectively and run:
   
```
npm install
```

2. Start frontend application for Tour Duty Tracker in project root folder
   
```
npm run serve
```

3. Start backend application for Tour Duty Tracker in backend folder
```
nodemon server
```

## Getting Started (Deploy)

This application is hosted on heroku, for more information, please contact me.