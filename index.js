const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'password',
  database: 'company',
});

const start = ()=> {
    inquirer
    .prompt({
      name: 'firstSelection',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['Add department, role or employee', 'View department, role or employee', 'Update employee role'],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
        switch(answer.firstSelection){
            case 'Add department, role or employee':
                console.log(answer)
                add()
                break;
            case 'View department, role or employee':
                view()
                break;
            case 'Update employee role':
                update()
                break;
        }
    });
}

const add = ()=> {
    inquirer
    .prompt({
      name: 'addSelection',
      type: 'list',
      message: 'What would you like to add?',
      choices: ['Department', 'Role', 'Employee'],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
        switch(answer.addSelection){
            case 'Department':
                console.log(answer)
                break;
            case 'Role':
                console.log(answer)
                break;
            case 'Employee':
                console.log(answer)
                break;
        }
    });};

const view = ()=> {
    inquirer
    .prompt({
      name: 'viewSelection',
      type: 'list',
      message: 'What would you like to view?',
      choices: ['Department', 'Role', 'Employee'],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
        switch(answer.viewSelection){
            case 'Department':
                console.log(answer)
                break;
            case 'Role':
                console.log(answer)
                break;
            case 'Employee':
                console.log(answer)
                break;;
                break;
        }
    });};

const update = ()=> {
    console.log("Updating!")
};


connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

//NEED TO ADD CONNECTION.END()!!!