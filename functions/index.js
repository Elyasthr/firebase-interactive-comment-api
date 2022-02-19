const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');

app.use(cors({origin: true}));

admin.initializeApp();
const db = admin.firestore();
// user function

app.post('/', async (req, res) => {
  const user = req.body;
  await db.collection('currentUser').add(user);
  res.status(201).send();
});

app.get('/:id', async (req, res) => {
  const snapshot = await db
      .collection('currentUser').doc(req.params.id).get();
  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({id: userId, ...userData}));
});

// comments functions
app.get('/', async (req, res) => {
  const snapshot = await db.collection('comments').get();

  const coms = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    coms.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(coms));
});

app.get('/comment/:id', async (req, res) => {
  const snapshot = await admin
      .firestore().collection('comments').doc(req.params.id).get();
  const commentId = snapshot.id;
  const commentData = snapshot.data();

  res.status(200).send(JSON.stringify({id: commentId, ...commentData}));
});

app.post('/comment', async (req, res) => {
  const comment = req.body;
  await db.collection('comments').add(comment);

  res.status(200).send();
});

app.put('/comment/:id', async (req, res) => {
  const editComment = req.body;
  await db
      .collection('comments').doc(req.params.id).update(editComment);

  res.status(200).send();
});

app.delete('/comment/:id', async (req, res) => {
  await db
      .collection('comments').doc(req.params.id).delete();

  res.status(200).send();
});

exports.user = functions.https.onRequest(app);

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});
