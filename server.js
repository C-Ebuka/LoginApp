const express = require('express');
const app = express();
const port = 3000;
const admin = require('firebase-admin');


// Middleware to parse JSON bodies
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Replace with your databaseURL
   databaseURL: "https://console.firebase.google.com/u/0/project/loginapp-210d1/"
});

const db = admin.firestore();

// Sample data (you can replace this with a database later)
let users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
];

let notes = [
  { id: 1, title: 'Note 1', content: 'Content of Note 1' },
  { id: 2, title: 'Note 2', content: 'Content of Note 2' }
];

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get a single user by id
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Create a new user
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user by id
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.name = req.body.name;
  res.json(user);
});

// Delete a user by id
app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(index, 1);
  res.json({ message: 'User deleted successfully' });
});

// Get all notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// Get a single note by id
app.get('/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// Create a new note
app.post('/notes', (req, res) => {
  const newNote = {
    id: notes.length + 1,
    title: req.body.title,
    content: req.body.content
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Update a note by id
app.put('/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ message: 'Note not found' });
  note.title = req.body.title;
  note.content = req.body.content;
  res.json(note);
});

// Delete a note by id
app.delete('/notes/:id', (req, res) => {
  const index = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Note not found' });
  notes.splice(index, 1);
  res.json({ message: 'Note deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
