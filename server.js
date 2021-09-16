const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 8001;

const db = require('./db/db.js');
var students = db.students;
var classes = db.classes;
const studentUtils = require('./utils/studentUtils.js');
const classUtils = require('./utils/classUtils.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Welcome to S4");
});

//STUDENTS
//List all students
app.get('/students', (req, res) => {
  console.log("Retreiving all students...");
  res.send(students);
  console.log("Completed successfully.");
});

//Add a student
app.post('/addstudent', (req, res) => {
  console.log("Adding a student: ");
  const student = req.body;
  student.id = parseInt(student.id);
  console.log(student);
  var invalidStudent = studentUtils.isInvalidStudent(student, students, true);
  if(invalidStudent) {
    console.log("Failed adding student: " + studentUtils.getFullName(student))
    console.log(invalidStudent);
    //send the error as response
    res.send(invalidStudent);
  } else {
    students.push(student);
    res.send(students);
    console.log("Student: " + studentUtils.getFullName(student) + " added successfully.");
  }
});

//Delete a student
app.delete('/deletestudent', (req, res) => {
  console.log("Deleting student: ");
  const student = req.body;
  student.id = parseInt(student.id);
  console.log(student);
  var invalidStudent = studentUtils.canDeleteStudent(student, students);
  if(invalidStudent) {
    console.log("Failed deleting student: " + studentUtils.getFullName(student))
    console.log(invalidStudent);
    //send the error as response
    res.send(invalidStudent);
  } else {
    students = students.filter(s => parseInt(student.id) !== s.id);
    res.send(students);
    console.log("Student: " + studentUtils.getFullName(student) + " deleted successfully.");
  }
});

//Edit a student
app.put('/editstudent', (req, res) => {
  console.log("Editing student: ");
  const student = req.body;
  student.id = parseInt(student.id);
  console.log(student);
  var invalidStudent = studentUtils.isInvalidStudent(student, students);
  if(invalidStudent) {
    console.log("Failed editing student: " + studentUtils.getFullName(student))
    console.log(invalidStudent);
    //send the error as response
    res.send(invalidStudent);
  } else {
    let index = students.findIndex(s => student.id === s.id);
    students[index] = student;
    res.send(students);
    console.log("Student: " + studentUtils.getFullName(student) + " edited successfully.");
  }
});


//CLASSES
//List all classes
app.get('/classes', (req, res) => {
  res.send(classes);
});

//Add a class
app.post('/addclass', (req, res) => {
  console.log("Adding a class: ");
  const newClass = req.body;
  newClass.code = parseInt(newClass.code);
  console.log(newClass);
  var invalidClass = classUtils.isInvalidClass(newClass, classes, true);
  if(invalidClass) {
    console.log("Failed adding class: " + newClass.name)
    console.log(invalidClass);
    //send the error as response
    res.send(invalidClass);
  } else {
    classes.push(newClass);
    res.send(classes);
    console.log("Class: " + newClass.name + " added successfully.");
  }
});

//Delete a class
app.delete('/deleteclass', (req, res) => {
  console.log("Deleting class: ");
  const classToDelete = req.body;
  classToDelete.code = parseInt(classToDelete.code);
  console.log(classToDelete);
  var invalidClass = classUtils.canDeleteClass(classToDelete, classes);
  if(invalidClass) {
    console.log("Failed deleting student: " + classToDelete.name)
    console.log(invalidClass);
    //send the error as response
    res.send(invalidClass);
  } else {
    classes = classes.filter(c => parseInt(classToDelete.code) !== c.code);
    res.send(classes);
    console.log("Class: " + classToDelete.name + " deleted successfully.");
  }
});

//Edit a class
app.put('/editclass', (req, res) => {
  console.log("Editing class: ");
  const newClass = req.body;
  newClass.code = parseInt(newClass.code);
  console.log(newClass);
  var invalidClass = classUtils.isInvalidClass(newClass, classes);
  if(invalidClass) {
    console.log("Failed editing class: " + newClass.name)
    console.log(invalidClass);
    //send the error as response
    res.send(invalidClass);
  } else {
    let index = classes.findIndex(c => newClass.code === c.code);
    classes[index] = newClass;
    res.send(classes);
    console.log("Class: " + newClass.name + " edited successfully.");
  }
});

//Register student to a class
app.post('/registerstudent', (req, res) => {
  console.log("Adding student to class: ");
  const {classCode, studentId} = req.body;
  let classCodeInt = parseInt(classCode);
  let studentIdInt = parseInt(studentId);
  console.log("class: " + classCode + " studentId: " + studentIdInt);
  var invalidRegistration = classUtils.isInvalidRegistration(classes, classCodeInt, studentIdInt);
  if(invalidRegistration) {
    console.log("Failed adding student to class: " + classCode);
    console.log(invalidRegistration);
    //send the error as response
    res.send(invalidRegistration);
  } else {
    let classToAdd = classes.find(c => classCodeInt === c.code);
    let classIndex = classes.findIndex(c => classCodeInt === c.code);
    if(classToAdd.enlistedStudents.includes(studentIdInt)) {
      res.send("Student already in class");
      return;
    }
    classToAdd.enlistedStudents.push(studentIdInt);
    classes[classIndex] = classToAdd;
    console.log(classToAdd);
    res.send(classToAdd);
    console.log("Student added to class successfully.");
  }
});

//get enlisted students in class
app.get('/class/:code', (req, res) => {
  console.log("Getting all students in class: ");
  const code = req.params.code;
  console.log(code);
  let codeAsInt = parseInt(code);
  const selectedClass = classes.find(c => codeAsInt === c.code);
  res.send(selectedClass.enlistedStudents.map(sid => students.find(s => sid === s.id)));
});

//get classes for student
app.get('/student/:id', (req, res) => {
  console.log("Getting all classes for student: ");
  const id = req.params.id;
  console.log(id);
  let idAsInt = parseInt(id);
  res.send(classes.filter(c => c.enlistedStudents.includes(idAsInt)));
});

app.use(function(req, res, next) {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname+'/errorpages/404.html'));
    return;
  }
  res.send('404: File Not Found');
});

app.listen(port, () => {
  console.log("S4 App running at localhost")
});