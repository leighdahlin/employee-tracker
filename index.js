const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')
const addDepartment = require('./lib/department.js');
const addRole = require('./lib/role.js');
const addEmployee = require('./lib/employee.js');
const chalk = require('chalk')
let managers = []

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'password',
  database: 'dunder_mifflin',
});

//function to kick off the inquirer prompts
const start = ()=> {
    inquirer
    .prompt({
      name: 'firstSelection',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['Add department, role or employee', 'View department, role or employee', 'Update employee role', 'Exit'],
    })
    .then((answer) => {
      // based on their answer, takes the user to a new set of prompts or ends the connection
        switch(answer.firstSelection){
            case 'Add department, role or employee':
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

//prompts to add a dep, role or ee
const add = ()=> {
    //the user selects what they'd like to add
    inquirer
    .prompt({
      name: 'addSelection',
      type: 'list',
      message: 'What would you like to add?',
      choices: ['Department', 'Role', 'Employee'],
    })
    .then(async(answer) => {
      // based on their answer, the imported add functions are run, then the user is taken back to the start menu
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
//prompts to view a dep, role or ee
const view = ()=> {
    inquirer
    .prompt({
      name: 'viewSelection',
      type: 'list',
      message: 'What would you like to view?',
      choices: ['Department', 'Role', 'Employee'],
    })
    .then((answer) => {
      //inputs managers into manager array in case user wants to view by manager, if put later, not enough time to execute before prompt
      getManagers();
        switch(answer.viewSelection){
            case 'Department':
              //querires MySql to display all departments
              connection.query('SELECT id AS Id, name AS Name FROM department', async(err,res) => {
                if (err) throw err;
                await console.table(chalk.black.bold.bgCyan('  Departments  '),res)
                await start()
            })
                break;
            case 'Role':
                //queries MySql to display all roles
                connection.query('SELECT id AS Id, title AS Title, salary AS Salary, department_id AS Department_Id FROM role', async(err,res) => {
                  if (err) throw err;
                  await console.table(chalk.black.bold.bgCyan('  Roles  '),res);
                  await start();
              })
                
                break;
            case 'Employee':
                //prompts the user how they'd like to view employee data
                inquirer.prompt([
                  {
                    name: 'chooseView',
                    type: 'list',
                    message: 'Choose below',
                    choices: ['View Employees by Department','View Employees by Id', 'View employees by Manager']
                  }
                ]).then(async(answer) => {
                  switch(answer.chooseView){
                    //queries MySql using a triple inner join to view employees by department
                    case 'View Employees by Department':
                      connection.query('SELECT department.id,name,first_name,last_name,title FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id)                      ', async(err,res) => {
                        if (err) throw err;
                        await console.table(chalk.black.bold.bgCyan('  Employees by Department  '),res)
                        await start();
                    })
                      break;
                    //queries MySql to view all employees in employee table
                    case 'View Employees by Id':
                      connection.query('SELECT * FROM employee', async(err,res) => {
                        if (err) throw err;
                        await console.table(chalk.black.bold.bgCyan('  Employees by Id  '),res)
                        await start();
                    })
                      break;
                    //queries MySql to view all employees by manager, first by getting a list of managers and displaying them as choices
                    case 'View employees by Manager':

                      inquirer.prompt([
                        {
                          name: 'manager',
                          type: 'list',
                          message: 'Choose manager',
                          choices: managers,
                        }
                      ]).then((answer) => {
                        let id = answer.manager
                        
                        //queries MySql using an inner join for the employee and role table to display all employees for a certain manager
                        connection.query('SELECT title,first_name,last_name FROM employee INNER JOIN role ON (employee.role_id = role.id) WHERE manager_id = ?',[id[0]],
                         async(err,res) => {
                          if (err) throw err;
                          await console.table(chalk.black.bold.bgCyan(`${answer.manager} Employees`),res)
                          await start();
                      })
                      })
                      
                      break;
                  }
                })
                break;
        }
    });};
//prompts to update an ee class
const update = ()=> {
  let employee;
  let roleId;
  //queries MySql for all employees
  
    //prompts the user for the employee's id who they want to update
    inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: 'What is the id for the employee you want to update?',
        validate (input) {
          if(input==="") {
              return 'Please enter the id for the employee';
          } else {
              return true;
          }
        },
    }
    ])
    .then(async(answer)=> {
      //queries MySql for the id that the user input
      await connection.query('SELECT * FROM employee WHERE id = ?', answer.id, async (err,results) => {
        if (err) throw err;
        //if there are results, continues to execute code
        if(results.length > 0){
          //displays employee data to user 
          await results.forEach((ee)=> {
            if (ee.id === parseInt(answer.id)){
              employee = ee;
              console.table([employee])
            }
          });
          //asks user to confirm if they selected the correct employee
          await inquirer.prompt([
            {
            name:'correct',
            type: 'confirm',
            message: 'Is this the employee you want to update?'
          }
          ])
          .then((answer) => {
            //if the user confirms they selected the correct employee, continues function
            if(answer.correct){
              //queries MySql for the titles of all roles and uses these as choices for the user
              //if larger db, will need to add additional prompt to for department so only pull up roles for one department
              connection.query('SELECT title FROM role', async (err,res)=> {
                if(err) throw err;
                let roles = []
                await res.forEach((item) => {
                  roles.push(item.title)
                })
                //prompts user for new role, using query above to generate choices
                await inquirer.prompt([
                  {
                  name: 'role', 
                  type: 'list',
                  message: 'Choose the employee\'s new role',
                  choices: roles
                  //FEATURE TO ADD:
                  // await roles.push('Add new role (if not listed above)')
              },
              ])
              .then(async(answer) => {
                //gets the id for the role selected
                await connection.query('SELECT id FROM role WHERE title = ?',
                  [answer.role],
                 async (err,res)=> {
                  if(err) throw err
                  roleId = parseInt(res[0].id);
                //updates the employees role in the db
                await connection.query(
                  'UPDATE employee SET ? WHERE ?',
                  [
                    {
                      role_id: roleId
                    },
                    {
                      id: employee.id
                    }
                  ],
                  (err,res)=> {
                    if(err)throw err;
                    console.log(chalk.magenta(`${res.affectedRows} employees updated!`));
                    start();
                  }
                )
                  
                });
      
              })
              
              })
            }
            else{
              //if the user confirms (N) when prompted if it's the right employee, restarts the id prompt
              update();
            }
          })
          //if no results, tells user that their input doesn't match and runs the id prompt again
        }else{
          console.log(chalk.magenta("That id does not match an employee in the database"))
          update();
        }
        
      })

    })
};

const getManagers = async () => {
  managers = [];
  await connection.query('SELECT employee.id,first_name,last_name,name FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id)', async (err,res) => {
      if(err) throw err
      await res.forEach(async (item) => {
          if(item.name === "Management"){
             managers.push(parseInt(item.id) + " - " + item.first_name + " " + item.last_name)
          }
          
      })
  })
  return managers;
}

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
