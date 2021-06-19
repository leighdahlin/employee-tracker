//The Role class is used to add to the role table

const inquirer = require("inquirer");
const mysql = require('mysql');
const departments = []

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

class Role {
    constructor() {
        return (async()=> {
            //runs each inquirer prompt defined in the functions below to build the contructor object for the Role class
            this.title = await this.getTitle();
            this.salary = await this.getSal();
            this.department_id = await this.getDeptId()
            return this;
        })();
        
    }
    //inquirer prompt to get the title of the role
    getTitle() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "What's the title of the role?",
                validate (input) {
                    if(input==="") {
                        return 'Please enter the title of the role';
                    } else {
                        return true;
                    }
                },
                
            },
            ]).then((answer)=> {   
                return answer.title;
            })
    };
    //inquirer prompt to get the salary of the role
    getSal() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'salary',
                message: "What's the role's salary?",
                validate (input) {
                    if(input==="") {
                        return 'Please enter the role\'s salary';
                    } else {
                        return true;
                    }
                },
                
            },
            ]).then((answer)=> {   
                return answer.salary;
            })
    };
    //inquirer prompt to get the department id of the role, using the getDepts() function to populate the choices
    getDeptId() {
        return inquirer
            .prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Select the department for the role',
                choices: departments,
            },
            ]).then((answer)=> { 
                    let id = answer.name
                    id.split(" ")
                    return id[0];
            })        
        
    };
}
//query MySql for all departments, used to populate the choices for the getDeptId() class function
const getDepts = async () => {
    await connection.query('SELECT * FROM department', async (err,res) => {
        if(err) throw err
        await res.forEach(async (item) => {
            await departments.push(parseInt(item.id) + " - " + item.name)
        })
    })
}

const addRole = async () => {
    //queries MySql for department data before creating the Role class, which generates the inquirer prompts
    await getDepts();
    const newRole = await new Role();
    await console.log(newRole)
    //uses the new role object to populate the MySql query to add it to the db
    const query = await connection.query(
        'INSERT INTO role SET ?',
        newRole,
        (err,res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role added!`)
        }
    );
    await console.log(query.sql);
    
}

//connection to MySql
connection.connect((err) => {
    if (err) throw err;
  });

//exports the addRole function to be used in the index.js file
module.exports = addRole;
