const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();

app.get('/timestamp', (request,response) => {
  response.send(`${Date.now()}`)
  console.log("DUH: ",request.body);
});

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.app = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
