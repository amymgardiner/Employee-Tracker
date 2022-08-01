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
    console.log(`Connected as id ${db.threadId}`);
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
            case 'Update employee\'s role':
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
        console.table(res);
        startApp();
    })
};

viewAllRoles = () => {
    db.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    })
};



// formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// enter the name of the department and that department is added to the database
// enter the name, salary, and department for the role and that role is added to the database
//  enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// select an employee to update and their new role and this information is updated in the database