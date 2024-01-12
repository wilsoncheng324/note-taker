const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let notes = require('./db/db.json');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

function createNewNote(body, notesarr) {
    const newNote = body;

    if (!Array.isArray(notesarr))
    notesarr = [];
    
    if (notesarr.length === 0)
    notesarr.push(0);

    body.id = notesarr[0];
    notesarr[0]++;

    notesarr.push(newNote);
    
    writeNotesToFile(notesarr);

    return newNote;
}

function deleteNote(id, notesarr) {
    notesarr = notesarr.filter(note => note.id != id);
    writeNotesToFile(notesarr);
}

function writeNotesToFile(notesarr) {
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesarr, null, 2)
    );
}

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
