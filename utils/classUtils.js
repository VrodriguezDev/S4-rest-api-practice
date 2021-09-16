var isInvalidClass = exports.isInvalidClass = (newClass, classes, addingNewClass) => {
  if(!newClass.code || !newClass.name) {
    return "Required information missing for class";
  }
  if(newClass.name === "") {
    return "Name can't be empty";
  }
  if(addingNewClass && classes.find(c => parseInt(newClass.code) === c.code)) {
    return "Class code already exists";
  }
  if(!classes.find(c => parseInt(newClass.code) === c.code)) {
    return "The code for the class you're trying to edit does not exist";
  }
  if(classes.find(c => parseInt(newClass.name) === c.name)) {
    return "Class with name: " + newClass.name + " already exists";
  }
};

var canDeleteClass = exports.canDeleteClass = (classToDelete, classes) => {
  if(!classToDelete.code) {
    return "Code not provided";
  }
  if(!classes.find(c => classToDelete.code === c.code)) {
    return "Code could not be found";
  }
}

var isInvalidRegistration = exports.isInvalidRegistration = (classes, classCode, studentId) => {
  if(!classCode || !studentId) {
    return "Need to provide classCode and studentId";
  }
  if(!classes.find(c => c.code === classCode)) {
    return "Invalid classCode";
  }
};