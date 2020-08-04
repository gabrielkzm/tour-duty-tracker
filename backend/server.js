const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const db_uri = process.env.ATLAS_URI;

mongoose.connect(db_uri, {useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully.');
});

const ambassadorsRouter = require('./routes/ambassadors');
const statisticsRouter = require('./routes/statistics');
const toursRouter = require('./routes/tours');
const assignmentsRouter = require('./routes/assignments');
const emailsRouter = require('./routes/emails');
const usersRouter = require('./routes/users');
const semestersRouter = require('./routes/semesters');
const settingsRouter = require('./routes/settings');

app.use('/api/ambassadors', ambassadorsRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/tours', toursRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/emails', emailsRouter);
app.use('/api/users', usersRouter);
app.use('/api/semesters', semestersRouter);
app.use('/api/settings', settingsRouter);

// DEPLOYMENT ONLY
// app.use(express.static(path.join(__dirname, '../dist')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../dist/index.html'))
// })

app.listen(port, () =>{
    console.log('Server has been initiated and is running successfully.')
});
