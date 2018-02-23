let mysql = require('mysql');
let inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});



function displayProducts(){
    connection.query('SELECT * FROM PRODUCTS', function (err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("--------------------------------------------");
            console.log("Item #: " + res[i].item_id);
            console.log("Item for sale: " + res[i].product_name);
            console.log("Price of the item: $" + res[i].price);
            console.log("--------------------------------------------");
        }
        buyProducts();
    });

};

function buyProducts() {
    inquirer.prompt([{
        type: "list",
        name: "buyproduct",
        message: "Please decide if you want to purhcase an item.",
        choices: ["YES", "NO"]
    }
    ]).then(function (value) {
        if (value.buyproduct === "YES") {
            selectProducts()
        }
        else if (value.buyproduct === "NO") {
            console.log("We hope you had a pleasant shopping experience.")
            connection.end();
        }
    })
}

function selectProducts() {
    inquirer.prompt([
        {
            type: "input",
            name: "item_number",
            message: "What is the item number of the product you wish to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }          
        },
        {
            type: "input",
            name: "quantity",
            message: "What quantity would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function (n) {
        console.log("Product added to the shopping cart.\n");
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: n.quantity
                },
                {
                    item_id: n.item_number
                }
            ],
            function(error) {
                if (error) throw err;
                console.log("Product added to your shopping cart.");
                console.log("The total for this product is $")
                buyProducts();
            }
        )
    })
}
