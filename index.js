const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const chalk = require('chalk');

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
    console.log(chalk.yellow.bold(`====================`));
    console.log(``);
    console.log(chalk.bgCyan.bold(`  EMPLOYEE TRACKER  `));
    console.log(``);
    console.log(chalk.yellow.bold(`====================`));
    console.log(``);
    startApp();
});

startApp = () => {
    inquirer.prompt([
        {
            name: 'initialPrompt',
            type: 'list',
            message: 'Welcome to the employee management program! What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by manager', 'View employees by department', 'View department budgets', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Update employee manager', 'Remove a department', 'Remove a role', 'Remove an employee', 'Exit program']
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
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'View department budgets':
                viewDepartmentSalary();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'Remove a department':
                removeDepartment();
                break;
            case 'Remove a role':
                removeRole();
                break;
            case 'Remove an employee':
                removeEmployee();
                break;
            // Exit program function
            case 'Exit program':
                db.end();
                console.log('You have exited the employee management program. Thanks for using!');
                return;
                default:
                break;
        }
    })
};

// View all departments
viewAllDepartments = () => {
    db.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res);
        startApp();
    })
};

// View all roles
viewAllRoles = () => {
    db.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res);
        startApp();
    })
};

// View all employees
viewAllEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res);
        startApp();
    })
};

// View employees by manager
viewEmployeesByManager = () => {
    db.query(`SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id AS employee, employee.first_name, employee.last_name, role.title
    FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL') INNER JOIN department ON (department.id = role.department_id) ORDER BY manager;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res);
        startApp();
    })
};

// View employees by department
viewEmployeesByDepartment = () => {
    db.query(`SELECT department.name AS department, role.title, employee.id AS employee, employee.first_name, employee.last_name FROM employee
    LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) ORDER BY department.name;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res);
        startApp();
    })
};

// View the total utilized budget of a department???in other words, the combined salaries of all employees in that department
viewDepartmentSalary = () => {
    db.query(`SELECT department.name AS Department, SUM(salary) AS Amount FROM role LEFT JOIN department on role.department_id = department.id GROUP BY department.id`, (err, res) => {
        if (err) throw err;
        console.table('\n', res);
        startApp(); 
    })
}

// Add a department
addDepartment = () => {
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

// Add a role
addRole = () => {
    db.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        
        let departments = res.map(department => ({name: department.name, value: department.id }));
        
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the name of the role you want to add?'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role you want to add?'   
            },
            {
            name: 'deptName',
            type: 'list',
            message: 'Which department do you want to add the new role to?',
            choices: departments
            },
        ])
        .then((response) => {
            db.query(`INSERT INTO role SET ?`, 
            {
                title: response.title,
                salary: response.salary,
                department_id: response.deptName,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.title} successfully added to database! \n`);
                startApp();
            })
        })
    })
};

// Add an employee
addEmployee = () => {
    db.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        
        let roles = res.map(role => ({name: role.title, value: role.id }));
        db.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}));
            
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: "What is the new employee's first name?"
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: "What is the new employee's last name?"
                },
                {
                    name: 'role',
                    type: 'list',
                    message: "What is the new employee's title?",
                    choices: roles
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Who is the new employee's manager?",
                    choices: employees
                }
            ])
            .then((response) => {
                db.query(`INSERT INTO employee SET ?`, 
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.role,
                    manager_id: response.manager,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.firstName} ${response.lastName} successfully added to database! \n`);
                    startApp();
                })
            })
        })
    })
};

// Update an employee role
updateEmployeeRole = () => {
    db.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        
        let roles = res.map(role => ({name: role.title, value: role.id }));
        
        db.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}));
            
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee would you like to update the role for?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'list',
                    message: "What should the employee's new role be?",
                    choices: roles
                }
            ])
            .then((response) => {
                db.query(`UPDATE employee SET ? WHERE ?`, 
                [
                    {
                        role_id: response.newRole,
                    },
                    {
                        id: response.employee,
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n Successfully updated employee's role in the database! \n`);
                    startApp();
                })
            })
        })
    })
};

// Update employee managers
updateEmployeeManager = () => {
    db.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
        
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to update the manager for?',
                choices: employees
            },
            {
                name: 'newManager',
                type: 'list',
                message: "Who should the employee's new manager be?",
                choices: employees
            },
        ])
        .then((response) => {
            db.query(`UPDATE employee SET ? WHERE ?`, 
            [
                {
                    manager_id: response.newManager,
                },
                {
                    id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully updated employee's manager in the database! \n`);
                startApp();
            })
        })
    })
};

// Delete departments
removeDepartment = () => {
    db.query(`SELECT * FROM department;`, (err, res) => {
        
        if (err) throw err;
        
        let departments = res.map(department => ({name: department.name, value: department.id }));
       
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departments
            },
        ])
        .then((response) => {
            db.query(`DELETE FROM department WHERE ?`, 
            [
                {
                    id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the department from the database! \n`);
                startApp();
            })
        })
    })
}

// Delte roles
removeRole = () => {
    db.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        
        let roles = res.map(role => ({name: role.title, value: role.id }));
        
        inquirer.prompt([
            {
            name: 'title',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roles
            },
        ])
        .then((response) => {
            db.query(`DELETE FROM role WHERE ?`, 
            [
                {
                    id: response.title,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the role from the database! \n`);
                startApp();
            })
        })
    })
}

// Delete employees
removeEmployee = () => {
    db.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
       
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employees
            },
        ])
        .then((response) => {
            db.query(`DELETE FROM employee WHERE ?`, 
            [
                {
                    id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the employee from the database! \n`);
                startApp();
            })
        })
    })
}