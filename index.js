const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username
        user: 'root',
        // Your MySQL password
        password: '',
        database: 'employeeTracker'
    },
);

db.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${db.threadId} \n`);
    startApp();
});

startApp = () => {
    inquirer.prompt([
        {
            name: 'initialPrompt',
            type: 'list',
            message: 'Welcome to the employee management program! What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit program']
        }
    ])
    .then((response) => {
        switch (response.initialPrompt) {
            case 'View all departments':
                viewAllDepartments();    
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addADepartment();
                break;
            case 'Add a role':
                addARole();
                break;
            case 'Add an employee':
                addAnEmployee();
                break;
            case "Update employee's role":
                updateEmployeeRole();
                break;
            case 'Exit program':
                db.end();
                console.log('You have exited the employee management program. Thanks for using!');
                return;
                default:
                break;
        }
    })
};

viewAllDepartments = () => {
    db.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewAllRoles = () => {
    db.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewAllEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

addADepartment = () => {
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the department you want to add?'   
        }
    ])
    .then((response) => {
        db.query(`INSERT INTO department SET ?`, 
        {
            name: response.newDept,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`\n ${response.newDept} successfully added to database! \n`);
            startApp();
        })
    })
};

// enter the name of the department and that department is added to the database
// enter the name, salary, and department for the role and that role is added to the database
//  enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// select an employee to update and their new role and this information is updated in the database