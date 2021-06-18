const inquirer = require("inquirer");
const mysql = require('mysql');
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
            this.first_name = await this.getFirstN();
            this.last_name = await this.getLastN();
            this.role_id = await this.getRoleId();
            this.manager_id = await this.getManagrId();
            return this;
        })();
        
    }

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
    async getManagrId() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'manager_id',
                message: "What's the id of the employee\'s manager?",
                choices: managers,
                //No validation because manager can be blank if they don't have a manager
            },
            ]).then((answer)=> {   
                let id = answer.manager_id
                id.split(" ")
                return id[0];
            })

    };
}

const getRoles = async () => {
    await connection.query('SELECT id,title FROM role', async (err,res) => {
        if(err) throw err
        await res.forEach(async (item) => {
            await roles.push(parseInt(item.id) + " - " + item.title)
        })
    })
}

const getManagers = async () => {
    await connection.query('SELECT employee.id,first_name,last_name,name FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id)', async (err,res) => {
        if(err) throw err
        await res.forEach(async (item) => {
            if(item.name === "Management"){
               managers.push(parseInt(item.id) + " - " + item.first_name + " " + item.last_name)
            }
            
        })
    })
}

const addEmployee = async () => {
    await getRoles();
    await getManagers();
    const newEmployee = await new Employee();
    await console.log(newEmployee)
    const query = await connection.query(
        'INSERT INTO employee SET ?',
        newEmployee,
        (err,res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee added!`)
        }
    );
    console.log(query.sql);
    
}

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
  });

module.exports = addEmployee;
