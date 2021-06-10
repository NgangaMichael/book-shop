const express = require("express");
const app = express()
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

const mongoose = require("mongoose");
const Books = require("./module/books");
mongoose.connect("mongodb://localhost:27017/booksop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(res => app.listen(3000, console.log("Connected to DB")))
.catch(err => console.log("Err on connection route", err))

app.get("/", (req, res) => {
    Books.find()
    .then(results => res.render("books/home", {books: results}))
    .catch(err => console.log("Err on get route", err))
});

app.get("/addbook", (req, res) => {
    res.render("books/addbook")
});

app.post("/addbook", (req, res) => {
    const newbook = Books(req.body)
    newbook.save()
    .then(results => res.redirect("/"))
    .catch(err => console.log("Err on post route", err))
});

app.get("/details/:id", (req, res) => {
    const {id} = req.params;
    Books.findById(id)
    .then(results => res.render("books/details", {book: results}))
    .catch(err => console.log("Err on details route", err))
});

app.get("/details/:id/edit", (req, res) => {
    const {id} = req.params;
    Books.findById(id)
    .then(results => res.render("books/edit", {book: results}))
    .catch(err => console.log("Err on edit route"))
});

app.patch("/details/:id", (req, res) => {
    const {id} = req.params;
    const {category, tags, image} = req.body;
    Books.findByIdAndUpdate(id, {"category": category, "tags": tags, "image": image})
    .then(results => res.redirect("/details/"+id))
    .catch(err => console.log("Err on patch route", err))
});

app.delete("/details/:id", (req, res) => {
    const {id} = req.params;
    Books.findByIdAndDelete(id)
    .then(results => res.redirect("/"))
    .catch(err => console.log("Err on delete route", err))
});

app.get("*", (req, res) => {
    res.render("books/notfound")
});