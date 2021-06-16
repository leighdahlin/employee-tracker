const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')
const addDepartment = require('./lib/department.js');
const addRole = require('./lib/role.js');
const addEmployee = require('./lib/employee.js');
const { star } = require('cli-spinners');

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
      choices: ['Add department, role or employee', 'View department, role or employee', 'Update employee role', 'Exit'],
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
            case 'Exit':
                connection.end();
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
    .then(async(answer) => {
      // based on their answer, either call the bid or the post functions
        switch(answer.addSelection){
            case 'Department':
                await addDepartment();
                await start()
                break;
            case 'Role':
                await addRole();
                await start();
                break;
            case 'Employee':
                await addEmployee();
                await start();
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
              connection.query('SELECT * FROM department', async(err,res) => {
                if (err) throw err;
                await console.table('Departments',res)
                await start()
            })
                // await start()
                break;
            case 'Role':
                connection.query('SELECT * FROM role', async(err,res) => {
                  if (err) throw err;
                  await console.table('Roles',res);
                  await start();
              })
                
                break;
            case 'Employee':
                connection.query('SELECT * FROM employee', async(err,res) => {
                  if (err) throw err;
                  await console.table('Employees',res)
                  await start();
              })
                break;
        }
    });};

const update = ()=> {
  connection.query('SELECT * FROM employee', async (err,results) => {
    if (err) throw err;
    await inquirer
    .prompt({
      name: 'id',
      type: 'input',
      message: 'What is the id for the employee you want to update?',
    })
    .then(async(answer)=> {
      let employee;
      await results.forEach((ee)=> {
        if (ee.id === parseInt(answer.id)){
          employee = ee;
          console.table([employee])
        }
      });
    })
    await inquirer.prompt({
      name:'correct',
      type: 'confirm',
      message: 'Is this the employee you want to update?'
    })
    .then((answer) => {
      console.log(answer)
    })
  })
  
    // const query = connection.query(
    //   'UPDATE employee SET ? WHERE ?'
    // )
};


connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

//NEED TO ADD CONNECTION.END()!!!
//add function with inquirer prompt to go back to start or exit