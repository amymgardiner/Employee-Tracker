const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username
        user: 'root',
        // Your MySQL password
        password: '',
        database: 'election'
    },
);

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    startApp();
});

startApp = () => {
    inquirer.prompt([
        {
            name: 'initialPrompt',
            type: 'list',
            message: 'Welcome to the employee management program! What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ])
};

// formatted table showing department names and department ids
// the job title, role id, the department that role belongs to, and the salary for that role
// formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// enter the name of the department and that department is added to the database
// enter the name, salary, and department for the role and that role is added to the database
//  enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// select an employee to update and their new role and this information is updated in the database