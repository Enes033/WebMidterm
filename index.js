const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const dbService = require('./dbService');
const { request } = require('http');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/insert', (request, response) => {
   const fullName = request.body.fullName;
   const email = request.body.email;
   const guests = request.body.guests;
   const date = request.body.date;
   const time = request.body.time;

   const db = dbService.getDbServiceInstance();

   const result = db.insertNewData(fullName, email, guests, date, time);

   result
   .then(data => response.json({success : true}))
   .catch(err => console.log(err));


});

app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

app.patch('/update', (request, response) => {
    const updateData = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateRecordById(updateData);
    
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

app.get('/search/:email', (request, response) => {
    const { email } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(email);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

app.listen(5000, () => console.log('app is running'));