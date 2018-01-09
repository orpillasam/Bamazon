let mysql = require('mysql');
let inquirer = rquire('inquirer');

var connection =mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: "root",

    password: "",
    database: "damazon"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start (){
    inquirer
        .prompt({
            name:"Bamazon";
        })
}
