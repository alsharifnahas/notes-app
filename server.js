// Dependencies
const { json } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Define a PORT to listen on
const PORT = process.env.PORT || 3000;

// Create a server using Express
const app = express();

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



// Reads the db.json file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post("/api/notes", (req, res) => {

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let notesArray = JSON.parse(data);
        let newNoteObject = req.body;
        newNoteObject.id = uuidv4();
        notesArray.push(newNoteObject);


        fs.writeFile('./db/db.json', JSON.stringify(notesArray), err => {
            if (err) throw err;
            console.log("Data Written");
        })
        res.send("Note has been saved");
    });
})

app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let notesArray = JSON.parse(data);
        let newNotesArray = notesArray.filter(note => {
            return note.id != id
        });


        fs.writeFile('./db/db.json', JSON.stringify(newNotesArray), err => {
            if (err) throw err;
            console.log("Data has been deleted");
        })
        res.send("Note has been deleted");
    });

})

// Returns the notes.html file.
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Returns the index.html file
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log(`App listening on PORT ${PORT}.`);
});