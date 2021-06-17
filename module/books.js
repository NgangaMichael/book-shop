const mongoose = require("mongoose");
const bookschema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
    category: String,
    tags: Array,
    image: String,
    price: Number
})

module.exports = new mongoose.model("Books", bookschema)
// module.exports = new mongoose.model("Books", bookschema.index({"$**": "text"}))
