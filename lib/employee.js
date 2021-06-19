//The Employee class is used to add to the employee table

const inquirer = require("inquirer");
const mysql = require('mysql');
const chalk = require('chalk')
const roles = []
const managers = []

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

class Employee {
    constructor() {
        return (async()=> {
            //runs each inquirer prompt defined in the functions below to build the contructor object for the Employee class
            this.first_name = await this.getFirstN();
            this.last_name = await this.getLastN();
            this.role_id = await this.getRoleId();
            this.manager_id = await this.getManagrId();
            return this;
        })();
        
    }
    //inquirer prompt to get the first name of the employee
    getFirstN() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What's the employee's first name?",
                validate (input) {
                    if(input==="") {
                        return 'Please enter the employee\'s first name';
                    } else {
                        return true;
                    }
                },
                
            },
            ]).then((answer)=> {   
                return answer.first_name;
            })
    };
    //inquirer prompt to get the last name of the employee
    getLastN() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'last_name',
                message: "What's the employee's last name?",
                validate (input) {
                    if(input==="") {
                        return 'Please enter the employee\'s last name';
                    } else {
                        return true;
                    }
                },
                
            },
            ]).then((answer)=> {   
                return answer.last_name;
            })
    };
    //inquirer prompt to get the role of the employee, using the getRole() function to populate the choices
    getRoleId() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'role_id',
                message: "Select the role for the employee",
                choices: roles,
            },
            ]).then((answer)=> {   
                let id = answer.role_id
                id.split(" ")
                return id[0];
        })
    };
    //inquirer prompt to get the manager id of the employee, using the getManagers() function to populate the choices
    getManagrId() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'manager_id',
                message: "What's the id of the employee\'s manager?",
                choices: managers,
            },
            ]).then((answer)=> {
                //if the employee doesn't have a manager, return null 
                if(answer.manager_id === "This employee doesn't have a manager"){
                    return null;
                } else {  
                //if the employee does have a manager,  return the first character of the answer's key pair value, which is the manager's id
                let id = answer.manager_id
                return id[0];
                }
            })

    };
}
//query MySql for all roles, used to populate the choices for the getRole() class function
//for larger data set, would need to add inquirer prompt for department and query roles for individual departments
const getRoles = async () => {
    await connection.query('SELECT id,title FROM role', async (err,res) => {
        if(err) throw err
        await res.forEach(async (item) => {
            await roles.push(parseInt(item.id) + " - " + item.title)
        })
    })
}
//query MySql for all managers and their ids by using a tripe inner join, used to populate the choices for the getManagerId() class function
const getManagers = async () => {
    await connection.query('SELECT employee.id,first_name,last_name,name FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id)', async (err,res) => {
        if(err) throw err
        await res.forEach(async (item) => {
            if(item.name === "Management"){
               managers.push(parseInt(item.id) + " - " + item.first_name + " " + item.last_name)
            }
            
        })
    })
    //push option to choices for employee's without a manager
    managers.push("This employee doesn't have a manager")
}

//function to add employee to the Employees table
const addEmployee = async () => {
    //queries MySql for role and manager data before creating the Employee class, which generates the inquirer prompts
    await getRoles();
    await getManagers();
    const newEmployee = await new Employee();
    await console.log(chalk.blue(newEmployee))
    //uses the new employee object to populate the MySql query to add it to the db
    const query = await connection.query(
        'INSERT INTO employee SET ?',
        newEmployee,
        (err,res) => {
            if (err) throw err;
            console.log(chalk.magenta(`${res.affectedRows} employee added!`))
        }
    );
    console.log(chalk.yellow(query.sql));
    
}
//connection to MySql
connection.connect((err) => {
    if (err) throw err;
  });

//exports the addEmployee function to be used in the index.js file
module.exports = addEmployee;
