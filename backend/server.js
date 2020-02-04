const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const ambassadorsRouter = require('./routes/ambassadors');
const statisticsRouter = require('./routes/statistics');
const toursRouter = require('./routes/tours');
const assignmentsRouter = require('./routes/assignments');
const emailsRouter = require('./routes/emails');

app.use(cors());
app.use(express.json());
app.use('/api/ambassadors', ambassadorsRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/tours', toursRouter);
app.use('/assignments', assignmentsRouter);
app.use('/emails', emailsRouter);

const db_uri = process.env.ATlAS_URI;
mongoose.connect(db_uri, {useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully.');
});

app.listen(port, () =>{
    console.log('Server has been initiated and is running successfully.')
});
