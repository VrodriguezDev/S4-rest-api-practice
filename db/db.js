//mock db
var students = exports.students = [];
students.push({id: 1, name: "Mike", lastname: "Smith"});
students.push({id: 2, name: "Jake", lastname: "Jones"});
students.push({id: 3, name: "Sonia", lastname: "Song"});
students.push({id: 4, name: "Laura", lastname: "Lee"});

var classes = exports.classes = [];
classes.push({code: 1, name: "Math", description: "Math class", enlistedStudents: [2]});
classes.push({code: 2, name: "English", description: "English class", enlistedStudents: [1, 3]});
classes.push({code: 3, name: "Spanish", description: "Spanish class", enlistedStudents: [3, 4]});