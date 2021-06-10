const mongoose = require("mongoose");
let Students = require("./module/students");

mongoose.connect("mongodb://localhost:27017/JKUAT", { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const mystudents = [
    {name:"Masika Jane", gender: "Female",age: 16, form: "Three", grade: "D" ,stream: "North"},
    {name:"Naaman Luke", gender: "Male",age: 17, form: "Three", grade: "B-" ,stream: "South"},
    {name:"Jecinta Shaw", gender: "Female",age: 16, form: "Three", grade: "C+" ,stream: "East"},
    {name:"Gerald Peter", gender: "Male",age: 16, form: "Three", grade: "C" ,stream: "West"},
    {name:"Stacy Kiloo", gender: "Female",age: 17, form: "Three", grade: "C+" ,stream: "East"},
    {name:"Alex Kyalo", gender: "Male",age: 16, form: "Three", grade: "A-" ,stream: "South"},
    {name:"Amelyne Okoo", gender: "Female",age: 17, form: "Three", grade: "C" ,stream: "North"},
    {name:"Laban Maundu", gender: "Male",age: 17, form: "Three", grade: "B-" ,stream: "West"}
];

Students.insertMany(mystudents).then(data => console.log(data)).catch(err => console.log(err))