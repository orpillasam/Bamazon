// Dependencies
let mysql = require('mysql');
let inquirer = require('inquirer');

//MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

//If it connects, then start the app
connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});

// Validating inputs are only positive integers
function validateNumber(value) {
    let integer = Number.isInteger(parseFloat(value))
    let sign = Math.sign(value)
    if (integer && sign === 1) {
      return true
    } else {
      return 'Please enter a positive number.'
    }
  }

  function promptUserPurchase() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'item_id',
          message:
            'Please enter the ID# of the product you wish to purchase.',
          validate: validateNumber,
          filter: Number,
        },
        {
          type: 'input',
          name: 'quantity',
          message: 'What quantity would you like to purchase?',
          validate: validateNumber,
          filter: Number,
        },
      ])
      .then(function(input) {
        let item = input.item_id
        let quantity = input.quantity
  
        let queryStr = 'SELECT * FROM products WHERE ?'
  
        connection.query(queryStr, { item_id: item }, function(err, data) {
          if (err) throw err
  
          if (data.length === 0) {
            console.log('ERROR: Invalid Item ID. Please select a valid Item ID.')
            displayInventory()
          } else {
            let productData = data[0]
            // Item in stock
            if (quantity <= productData.stock_quantity) {
              console.log('In Stock. Placing order now...')
              let updateQueryStr =
                'UPDATE products SET stock_quantity = ' +
                (productData.stock_quantity - quantity) +
                ' WHERE item_id = ' +
                item
              //Inventory update
              connection.query(updateQueryStr, function(err, data) {
                if (err) throw err
                console.log(
                  'Your order has been placed! Your total is $' +
                    productData.price * quantity +
                    '\nThank you for shopping with Bamazon!\n----------------------------------------\n'
                )
                connection.end()
              })
            } else {
              console.log(
                "We're sorry. The quantity you ordered is unavailable.\nPlease change your order.\n----------------------------------------\n"
              )
              displayProducts()
            }
          }
        })
      })
  }
  
  function displayProducts() {
    queryStr = 'SELECT * FROM products'
    connection.query(queryStr, function(err, data) {
      if (err) throw err
      let res = ''
      for (let i = 0; i < data.length; i++) {
        res = ''
        res += 'Item ID: ' + data[i].item_id + '\n'
        res += 'Product Name: ' + data[i].product_name + '\n'
        res += 'Department: ' + data[i].department + '\n'
        res += 'Price: $' + parseFloat(data[i].price).toFixed(2) + '\n'
        console.log(res + '\n----------------------------------------\n')
        
      }
      promptUserPurchase()
    })
  }
