require('dotenv').config();

// This section of my code allows me to import the inquirer and mysql modules into my JavaScript file. 
const inquirer = require('inquirer');
const mysql = require('mysql12/promise');

//This section of my code will allow for my database connection configuration 
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

//This section of my code is my function to view all roles 
async function viewRoles() {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM role');
    console.table(rows);
    connection.end();
}

//This is my function to view all employees 
async function viewEmployees() {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM employee');
    console.table(rows);
    connection.end();
}

//This is my function to add role 
async function addRole() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        const roleData = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title',
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