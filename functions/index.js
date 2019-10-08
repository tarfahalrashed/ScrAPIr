const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {format} = require('util');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const request = require('request');
const $ = jQuery = require('jquery');
const bodyParser = require("body-parser");
const proxy = require('http-proxy');

const os = require('os');
const tmp = os.tmpdir();
// const filePath = path.join(tmpdir,'index.html');
// await fse.ensureDir(workingDir);


const app = express();
app.set('view engine', 'pug');
//need to parse HTTP request body
app.use(bodyParser.json());
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// var ob={"a":"1", "b":"2"}
//
// app.get('/timestamp', (request,response) => {
//   response.send(`${Date.now()}`)
//   console.log("DUH: ",request.body);
// });
//
// exports.app = functions.https.onRequest(app);
//
//
// const {Storage} = require('@google-cloud/storage');
//
// // const googleStorage = require('@google-cloud/storage');
// const Multer = require('multer');
//
// const storage = new Storage({
//   projectId: "superapi-52bc2",
//   keyFilename: "firebase-adminsdk-da6uf@superapi-52bc2.iam.gserviceaccount.com"
// });
//
// const bucket = storage.bucket("gs://superapi-52bc2.appspot.com/");//<Firebase Storage Bucket URL");
//
// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
//   }
// });
//
//
// // app.listen(3000, () => {
// //   console.log('App listening to port 3000');
// // });
//
// /**
//  * Adding new file to the storage
//  */
// app.post('/upload', multer.single('file'), (req, res) => {
//   console.log('Upload Image');
//
//   let file = req.file;
//   if (file) {
//     uploadImageToStorage(file).then((success) => {
//       res.status(200).send({
//         status: 'success'
//       });
//     }).catch((error) => {
//       console.error(error);
//     });
//   }
// });
//
// /**
//  * Upload the image file to Google Storage
//  * @param {File} file object that will be uploaded to Google Storage
//  */
// const uploadImageToStorage = (file) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject('No image file');
//     }
//     let newFileName = `${file.originalname}_${Date.now()}`;
//
//     let fileUpload = bucket.file(newFileName);
//
//     const blobStream = fileUpload.createWriteStream({
//       metadata: {
//         contentType: file.mimetype
//       }
//     });
//
//     blobStream.on('error', (error) => {
//       reject('Something is wrong! Unable to upload at the moment.');
//     });
//
//     blobStream.on('finish', () => {
//       // The public URL can be used to directly access the file via HTTP.
//       const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
//       resolve(url);
//     });
//
//     blobStream.end(file.buffer);
//   });
// }
//
//
// app.set('view engine', 'pug');
// //need to parse HTTP request body
// app.use(bodyParser.json());
// // Automatically allow cross-origin requests
// app.use(cors({ origin: true }));
//
// // var ob={"a":"1", "b":"2"}
// //
// // app.get('/timestamp', (request,response) => {
// //   response.send(`${Date.now()}`)
// //   console.log("DUH: ",request.body);
// // });
//
// exports.app = functions.https.onRequest(app);
//
//
//
// app.post('/writeFile1', (request,response) => {
// // app.post('/writeFile',function(request,response){
//   var FileContent=request.body.FileContent;
//   var FileName=request.body.FileName;
//
//   response.send(JSON.parse(FileContent));
//   //response.send(JSON.stringify(ob))
//
//   //Wrting Json file
//   // fs.writeFile('../superapi-52bc2/us-central1/app/specs/'+FileName+'.json', FileContent);
//   // fs.writeFile(__dirname+'/specs/AbTest.json', JSON.stringify(ob));
//   // fs.writeFile('../specs/'+FileName+'.json', FileContent);
//
//   //CORRECT
//   //'../public/specs/'+
//   // fs.writeFileSync('/tmp/'+FileName+'.json', FileContent, (err) => {
//   //   if (err) throw err;
//   //   console.log('The file has been saved!');
//   // });
//
//   // fs.writeFileSync('/tmp/'+FileName+'.json', FileContent, (err) => {
//   //   // if (err) response.send(err);
//   //   console.log('The file has been saved!');
//   // });
//
// });
//
//
//
// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// // exports.app = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });
