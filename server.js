const express = require("express");
const path = require('path');
const { google } = require('googleapis');
const fs = require('fs');

// const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const server = express();
const PORT = process.env.PORT || 5222;

// Encoding middleware inbuilt to express
server.use(express.urlencoded({ extended: false }));
// JSON Middleware
server.use(express.json());


// Route handlers
server.get('/', (req, res) => {
  res.status(200).send({ message: "Welcome Brian" });
});

// Custom 404
server.get('/*', (req, res) => {
  res.status(404).send({ message: "Route not Found" });
});




// Load client secrets from a file you obtained from the Google API Console
const credentials = require('./client_secret.json');

// Create an OAuth2 client
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Define the scope for Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Check if we have previously stored a token
fs.readFile('token.json', (err, token) => {
  if (err) {
    getAccessToken(oAuth2Client);
  } else {
    oAuth2Client.setCredentials(JSON.parse(token));
    uploadFile(oAuth2Client);
  }
});

// Function to get an access token
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question('Enter the code from that page here: ', (code) => {
    readline.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);

      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      fs.writeFile('token.json', JSON.stringify(token), (err) => {
        if (err) console.error('Error writing token to file', err);
        console.log('Token stored to token.json');
      });

      // uploadFile(oAuth2Client);
    });
  });
}

// Function to upload a file to Google Drive
function uploadFile(auth) {
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: 'example.txt', // Change this to the name of your file
  };

  const media = {
    mimeType: 'text/plain', // Change this to the appropriate MIME type
    body: fs.createReadStream('example.txt'), // Change this to the path of your file
  };

  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    },
    (err, file) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        console.log('File ID:', file.data.id);
      }
    }
  );
}




server.listen(PORT, () => console.log(`Howdy, you server is running on : http://localhost:${PORT}`));

module.exports.server = server;