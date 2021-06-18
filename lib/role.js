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
            this.title = await this.getTitle();
            this.salary = await this.getSal();
            this.department_id = await this.getDeptId()
            return this;
        })();
        
    }

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

const getDepts = async () => {
    await connection.query('SELECT * FROM department', async (err,res) => {
        if(err) throw err
        await res.forEach(async (item) => {
            await departments.push(parseInt(item.id) + " - " + item.name)
        })
    })
}

const addRole = async () => {
    await getDepts();
    const newRole = await new Role();
    await console.log(newRole)
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


connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
  });

module.exports = addRole;
