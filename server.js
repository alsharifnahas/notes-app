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


// Post request to store the new notes to the JSON file
app.post("/api/notes", (req, res) => {

    // Reads the JSON file
    // and stores the read data to a new array of objects.
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let notesArray = JSON.parse(data);
        let newNoteObject = req.body;
        newNoteObject.id = uuidv4();

        // the new notes that is pulled from the request gets pushed to the end of the array
        // and updates the array with the new and old notes data
        notesArray.push(newNoteObject);

        // writes the updated array to the JSON file
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), err => {
            if (err) throw err;
            console.log("Data Written");
        })

        // note to make sure that the data is stored
        res.send("Note has been saved");
    });
})


// Delete request to delete the desired note by ID
app.delete("/api/notes/:id", (req, res) => {

    // id pulled from the route parameter
    let id = req.params.id;

    // Reads the JSON file to store the note inside of an object array
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let notesArray = JSON.parse(data);

        // The new array leaves the note object with the matching Id out
        // therefore the new array does not contain the note that is supposed to be deleted.
        let newNotesArray = notesArray.filter(note => {
            return note.id != id
        });

        // Write the new array to JSON file
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