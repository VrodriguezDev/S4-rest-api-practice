var getFullName = exports.getFullName = (student) => student.lastname + ", " + student.name;

var isInvalidStudent = exports.isInvalidStudent = (student, students, newStudent) => {
  if(!student.id || !student.name || !student.lastname) {
    return "Required information missing for student";
  }
  if(student.name === "") {
    return "Name can't be empty";
  }
  if(student.lastname === "") {
    return "Last name can't be empty";
  }
  if(newStudent && students.find(s => parseInt(student.id) === s.id)) {
    return "Student id already exists";
  }
  if(!students.find(s => parseInt(student.id) === s.id)) {
    return "The id for the student you're trying to edit does not exist";
  }
  if(students.find(s => getFullName(student) === getFullName(s))) {
    return "Student with full name: " + getFullName(student) + " already exists";
  }
};

var canDeleteStudent = exports.canDeleteStudent = (student, students) => {
  if(!student.id) {
    return "Id not provided";
  }
  if(!students.find(s => parseInt(student.id) === s.id)) {
    return "Id could not be found";
  }
}
