// requirering required packages 
const express = require("express");
const app = express()
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");

// setting enviroment for node 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

// requiring mongoose and the schema and connecting to DB 
const mongoose = require("mongoose");
const Books = require("./module/books");
mongoose.connect("mongodb://localhost:27017/booksop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(res => app.listen(3000, console.log("Connected to DB")))
.catch(err => console.log("Err on connection route", err))

// define storage for images 
const storage = multer.diskStorage({
    // destination for files 
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/images")
    },

    // add back the extensions 
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }

});

// upload parameters for multer 
const upload = multer({
    storage: storage,
    limits: {
        // this is 3 mb 
        fieldSize: 1024 * 1024 * 3
    }
});

// setting home route for all books 
app.get("/", (req, res) => {
    Books.find()
    .then(results => res.render("books/home", {books: results}))
    .catch(err => console.log("Err on get route", err))
});

// getting route for addding book 
app.get("/addbook", (req, res) => {
    res.render("books/addbook")
});

// search books route not functional yet
app.get("/search", (req, res) => {
    const {searchString} = req.query.search
    // Books.find({$text: {$search: searchString}})
    Books.find({$text: {$search: searchString}})
    .then(results => console.log(results.title))
    .catch(err => console.log(err))
});

// setting post route for adding a book 
app.post("/addbook", upload.single("image"), (req, res) => {
    const newbook = new Books({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags,
        price: req.body.price,
        image: req.file.filename,
    })
    newbook.save()
    .then(results => res.redirect("/"))
    .catch(err => console.log("Err on post route", err))
});

// code for getting similar books, not functionl yet
const bks = function(req, res) {
    Books.find()
    .then(results => res.render("books/details", {books: results}))
    .catch(err => console.log(err))
}

// route for desplaying details for each book 
app.get("/details/:id", (req, res) => {
    const boks = bks()
    const {id} = req.params;
    Books.findById(id)
    .then(results => res.render("books/details", {book: results, boks}))
    .catch(err => console.log("Err on details route", err))
});

// route for editing details for a specific book 
app.get("/details/:id/edit", (req, res) => {
    const {id} = req.params;
    Books.findById(id)
    .then(results => res.render("books/edit", {book: results}))
    .catch(err => console.log("Err on edit route"))
});

// pathc route for posting edited information to the DB 
app.patch("/details/:id", upload.single("image"), (req, res) => {
    const {id} = req.params;
    const {category, tags, price} = req.body;
    Books.findByIdAndUpdate(id, {
        "category": category, 
        "tags": tags, 
        image: req.file.filename,
        "price": price
        })
    .then(results => res.redirect("/details/"+id))
    .catch(err => console.log("Err on patch route", err))
});

// delete Route for deleting a specific book 
app.delete("/details/:id", (req, res) => {
    const {id} = req.params;
    Books.findByIdAndDelete(id)
    .then(results => res.redirect("/"))
    .catch(err => console.log("Err on delete route", err))
});

// catching all route that are not specified above 
app.get("*", (req, res) => {
    res.render("books/notfound")
});