//The Department class is used to add to the department table

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
    //inquirer prompt to get the name of the department
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
//function to add a new deparment to the department table
const addDepartment = async () => {
    //creates the Deparment class, which generates the inquirer prompts
    const newDepartment = await new Department();
    await console.log(newDepartment)
    //uses the new department object to populate the MySql query to add it to the db
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
//connection to MySql
connection.connect((err) => {
    if (err) throw err;
  });

//exports the addDepartment function to be used in the index.js file
module.exports = addDepartment;
