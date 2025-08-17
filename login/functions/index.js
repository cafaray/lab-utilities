/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

"use strict";
// const functions = require("firebase-functions");

const {setGlobalOptions} = require("firebase-functions/v2/options");
const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');
// const language = require('@google-cloud/language');
//const client = new language.LanguageServiceClient();
const express = require('express');


// Follow instructions to set up admin credentials:
// https://firebase.google.com/docs/functions/local-emulator#set_up_admin_credentials_optional
// admin.initializeApp({
  // credential: admin.credential.applicationDefault(),
  // TODO: ADD YOUR DATABASE URL
  //databaseURL: undefined
// });

admin.initializeApp();

setGlobalOptions({ maxInstances: 10, region: 'europe-southwest1', memory: '256MiB', timeoutSeconds: 60 });

const app = express();
app.use(express.json()); // important for JSON bodies

app.post("/login-check", async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch(e) {
    console.error("Token verification failed:", e);
    res.status(403).send('Unauthorized');
    return;
  }
});
app.post("/user-data", async (req, reply) => {
    const { idToken, profileData } = req.body;
    const decoded = await verifyToken(idToken);

    if (!decoded) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const uid = decoded.uid;
    const userRef = db.collection("users").doc(uid);
    await userRef.set({ profileData }, { merge: true });

    return { message: "Data stored", uid };
});
app.get("/", async (req, reply) => {
    reply.status(200).send({ message: "Hello from function auth utilities" });    
});
// app.use(authenticate);

// Expose the API as a function
exports.api = onRequest(app);

async function verifyToken(idToken) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      return decoded;
    } catch (err) {
      console.error("Token verification failed:", err);
      return null;
    }
}