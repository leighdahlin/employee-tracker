const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')
const addDepartment = require('./lib/department.js');
const addRole = require('./lib/role.js');
const addEmployee = require('./lib/employee.js');
// const { star } = require('cli-spinners');
// const { forEach } = require('lodash');
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
      //inputs managers into manager array in case user wants to view by manager, if put later, not enough time to execute before prompt
      getManagers();
        switch(answer.viewSelection){
            case 'Department':
              connection.query('SELECT * FROM department', async(err,res) => {
                if (err) throw err;
                await console.table('Departments',res)
                await start()
            })
                break;
            case 'Role':
                connection.query('SELECT * FROM role', async(err,res) => {
                  if (err) throw err;
                  await console.table('Roles',res);
                  await start();
              })
                
                break;
            case 'Employee':
                inquirer.prompt([
                  {
                    name: 'chooseView',
                    type: 'list',
                    message: 'Choose below',
                    choices: ['View Employees by Department','View Employees by Id', 'View employees by Manager']
                  }
                ]).then(async(answer) => {
                  switch(answer.chooseView){
                    case 'View Employees by Department':
                      connection.query('SELECT department.id,name,first_name,last_name,title FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id)                      ', async(err,res) => {
                        if (err) throw err;
                        await console.table('Employees by Department',res)
                        await start();
                    })
                      break;
                    case 'View Employees by Id':
                      connection.query('SELECT * FROM employee', async(err,res) => {
                        if (err) throw err;
                        await console.table('Employees by Id',res)
                        await start();
                    })
                      break;
                    case 'View employees by Manager':

                      inquirer.prompt([
                        {
                          name: 'manager',
                          type: 'list',
                          message: 'Choose manager',
                          choices: managers,
                        }
                      ]).then((answer) => {
                        console.log(answer)
                        let id = answer.manager
                        // id.split(" ")
                        
                        connection.query('SELECT title,first_name,last_name FROM employee INNER JOIN role ON (employee.role_id = role.id) WHERE manager_id = ?',[id[0]],
                         async(err,res) => {
                          if (err) throw err;
                          await console.table(`${answer.manager} Employees`,res)
                          await start();
                      })
                      })
                      
                      break;
                  }
                })
                break;
        }
    });};

const update = ()=> {
  let employee;
  let roleId;

  connection.query('SELECT * FROM employee', async (err,results) => {
    if (err) throw err;
    await inquirer
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
      await results.forEach((ee)=> {
        if (ee.id === parseInt(answer.id)){
          employee = ee;
          console.table([employee])
        }
      });
    })
    await inquirer.prompt([
      {
      name:'correct',
      type: 'confirm',
      message: 'Is this the employee you want to update?'
    }
    ])
    .then((answer) => {
      if(answer.correct){
        connection.query('SELECT title FROM role', async (err,res)=> {
          if(err) throw err;
          let roles = []
          await res.forEach((item) => {
            roles.push(item.title)
          })
          //FEATURE TO ADD:
          // await roles.push('Add new role (if not listed above)')
          await inquirer.prompt([
            {
            name: 'role', 
            type: 'list',
            message: 'Choose the employee\'s new role',
            choices: roles
        },
        ])
        .then(async(answer) => {
          await connection.query('SELECT id FROM role WHERE title = ?',
            [answer.role],
           async (err,res)=> {
            if(err) throw err
            roleId = parseInt(res[0].id);
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
              console.log(`${res.affectedRows} employees updated!`);
              start();
            }
          )
            
          });

        })
        
        })
      }
      else{
        update();
      }
    })
  })
  
    
};

const getManagers = async () => {
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

//NEED TO ADD CONNECTION.END()!!!
//add function with inquirer prompt to go back to start or exit