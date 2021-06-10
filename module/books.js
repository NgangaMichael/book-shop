const mongoose = require("mongoose");
const bookschema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
    category: String,
    tags: Array,
    imageUrl: String
})

module.exports = new mongoose.model("Books", bookschema)