# Employee Tracker

## About

A command-line application, built from scratch, to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## What it does

It is a command-line application that accepts user input through Node.js and Inquirer.

When you start the application, then you will be presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role. As a bonus I also added options for updating employee managers, viewing employees by manager, viewing employees by department, and deleting departments, roles, and employees.

When you choose to view all departments, the you will be presented with a formatted table showing department names and department ids. This table will show the information in the database through MySQL.

When you choose to view all roles, then you will be presented with the job title, role id, the department that role belongs to, and the salary for that role.

When you choose to view all employees, then you will be presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.

When you choose to add a department, then you will be prompted to enter the name of the department and that department is added to the database. When you choose to add a role, then you will be prompted to enter the name, salary, and department for the role and that role is added to the database.

When you choose to add an employee, then you will be prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database. And finally, for the last of the acceptance criteria prompts, when you choose to update an employee role, then you will be prompted to select an employee to update and their new role and this information is updated in the database.

## How to use it

You will first need to download [Node.js](https://coding-boot-camp.github.io/full-stack/nodejs/how-to-install-nodejs) and [MySQL](https://coding-boot-camp.github.io/full-stack/mysql/mysql-installation-guide).

Next you will need to clone my [GitHub Repository](https://github.com/amymgardiner/Employee-Tracker).

Once you're in the file relating to my code, in your command line you will enter:

npm install

which installs the dependencies to the local node_modules folder. By default, npm install will install all modules listed as dependencies in package.json.

Next, you'll want to enter in your MySQL username and your MySQL password in the fields I have listed in index.js.

Finally, the application will be invoked by using the following command:

node index.js
