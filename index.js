require('dotenv').config();

// Import necessary modules
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Function to view all roles
async function viewRoles() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM role');
        console.table(rows);
    } catch (error) {
        console.error('Error viewing roles:', error);
    } finally {
        connection.end();
    }
}

// Function to view all employees
async function viewEmployees() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM employee');
        rows.forEach((employee) => {
            console.log(`Employee ID: ${employee.id}, Name: ${employee.first_name} ${employee.last_name}`);
        });
    } catch (error) {
        console.error('Error viewing employees:', error);
    } finally {
        connection.end();
    }
}

// Function to add a role
async function addRole() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const roleData = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:',
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter the department ID for the role:',
            },
        ]);

        const [rows, fields] = await connection.execute(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [roleData.title, roleData.salary, roleData.department_id]
        );

        console.log(`Role "${roleData.title}" added with ID ${rows.insertId}`);
    } catch (error) {
        console.error('Error adding role:', error);
    } finally {
        connection.end();
    }
}
// Function to add an Employee
async function addEmployee() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Fetch existing roles
        const [roles] = await connection.execute('SELECT id, title FROM role');
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        const employeeData = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the employee\'s first name:',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the employee\'s last name:',
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the role for the employee:',
                choices: roleChoices,
            },
            {
                type: 'input',
                name: 'manager_id',
                message: 'Enter the manager ID for the employee (or leave blank for no manager):',
            },
        ]);

        const [rows, fields] = await connection.execute(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [employeeData.first_name, employeeData.last_name, employeeData.role_id, employeeData.manager_id || null]
        );

        console.log(`Employee "${employeeData.first_name} ${employeeData.last_name}" added with ID ${rows.insertId}`);
    } catch (error) {
        console.error('Error adding employee:', error);
    } finally {
        connection.end();
    }
}
// Function to update an employee's role
async function updateEmployeeRole() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const employees = await connection.execute('SELECT * FROM employee');
        const roles = await connection.execute('SELECT * FROM role');

        const employeeChoices = employees[0].map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        const roleChoices = roles[0].map((role) => ({
            name: role.title,
            value: role.id,
        }));

        const employeeToUpdate = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'new_role_id',
                message: 'Select the new role for the employee:',
                choices: roleChoices,
            },
        ]);

        await connection.execute(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [employeeToUpdate.new_role_id, employeeToUpdate.employee_id]
        );

        console.log('Employee role updated successfully.');
    } catch (error) {
        console.error('Error updating employee role:', error);
    } finally {
        connection.end();
    }
}
// Function to view all departments
async function viewDepartments() {
    const connection = await mysql.createConnection(dbConfig);
    try {
       
        const [rows, fields] = await connection.execute('SELECT * FROM department');
        console.table(rows);
    } catch (error) {
        console.error('Error viewing departments:', error);
    } finally {
        connection.end();
    }
}
// Function to add a department
async function addDepartment() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const departmentData = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:',
            },
        ]);

        const [rows, fields] = await connection.execute(
            'INSERT INTO department (name) VALUES (?)',
            [departmentData.name]
        );

        console.log(`Department "${departmentData.name}" added with ID ${rows.insertId}`);
    } catch (error) {
        console.error('Error adding department:', error);
    } finally {
        connection.end();
    }
}

// Function to view employees by department
async function viewEmployeesByDepartment() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Implement logic to view employees by department
    } catch (error) {
        console.error('Error viewing employees by department:', error);
    } finally {
        connection.end();
    }
}

// Main menu
async function mainMenu() {
    const menuChoice = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: [
            'View All Roles',
            'View All Employees',
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'View All Departments',
            'Add Department',
            'View Employees by Department',
            'Exit',
        ],
    });

    switch (menuChoice.action) {
        case 'View All Roles':
            await viewRoles();
            break;
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'View Employees by Department':
            await viewEmployeesByDepartment();
            break;
        case 'Exit':
            console.log('Exiting application.');
            process.exit();
    }

    // After completing the chosen action, return to the main menu
    mainMenu();
}

// Start the application
mainMenu();




