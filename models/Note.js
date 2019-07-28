var mongoose = require("mongoose");

//Saves a reference to Schema constructor
var Schema = mongoose.Schema;

//Creates a new NoteSchema object using the Schema constructor
var NoteSchema = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;