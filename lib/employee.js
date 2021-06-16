const inquirer = require("inquirer");
const mysql = require('mysql');

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
                type: 'input',
                name: 'role_id',
                message: "What's the id of the employee's role?",
                validate (input) {
                    if(input==="") {
                        return 'Please enter the id of the employee\'s role';
                    } else {
                        return true;
                    }
                },
                
            },
            ]).then((answer)=> {   
                return answer.role_id;
            })
    };
    getManagrId() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'manager_id',
                message: "What's the id of the employee\'s manager?",
                validate (input) {
                    if(input==="") {
                        return 'Please enter the id of the employee\'s manager';
                    } else {
                        return true;
                    }
                },
                
            },
            ]).then((answer)=> {   
                return answer.manager_id;
            })
    };
}

const addEmployee = async () => {
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
