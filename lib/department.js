const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table')

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

class Department {
    constructor() {
        return (async()=> {
            this.name = await this.getName();
            return this;
        })();
        
    }

    getName() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: "What's the department's name?",
                validate (input) {
                    if(input==="") {
                        return 'Please enter the department\'s name';
                    } else {
                        return true;
                    }
                },
                
            },
            ]).then((answer)=> {   
                return answer.name;
            })
    };
}

const addDepartment = async () => {
    const newDepartment = await new Department();
    await console.log(newDepartment)
    const query = await connection.query(
        'INSERT INTO department SET ?',
        newDepartment,
        (err,res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} department added!`)
        }
    );
    console.log(query.sql);
    
}

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
  });

module.exports = addDepartment;
