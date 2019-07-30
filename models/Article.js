var mongoose = require("mongoose");

//Saves reference to the Schema constructor
var Schema = mongoose.Schema;

//Creates a new UserSchema object using the Schema constructor
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }, 
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
    saved: {
        type: Boolean,
        required: false
    }
    
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;