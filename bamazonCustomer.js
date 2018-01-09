let mysql = require('mysql');
let inquirer = require('inquirer');

var connection =mysql.createConnection({
    host: 'localhost',
    port: 3306,

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
            console.log(" - - - - - - - - - - - - - - - ");
            console.log("item #: " + res[i].item_id);
            console.log("item for sale: " + res[i].product_name);
            console.log("price of item: $" + res[i].price);
        }
        buyProduct();
    });

};

function buyProduct() {
    inquirer.prompt([{
        type: "list",
        name: "buyproduct",
        message: "Would you like to purchase an item?",
        choices: ["YES", "NO"]
    }
    ]).then(function (value) {
        if (value.buyproduct === "YES") {
            selectProduct()
        }
        else if (value.buyproduct === "NO") {
            console.log("Thank you for shopping with Bamazon!")
            connection.end();
        }
    })
}

function selectProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "item_number",
            message: "What item number would you like to purchase?",
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
            message: "How many would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function (n) {
        console.log("Adding product to the shopping cart.\n");
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
                console.log("Product has been added to your shopping cart!");
                console.log("Your total for this item is $")
                buyProduct();
            }
        )
    })
}


