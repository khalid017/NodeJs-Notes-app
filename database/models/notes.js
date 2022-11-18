const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    uId:String,
    note:String
})

const notesModel = mongoose.model("notes",notesSchema)

module.exports = notesModel 