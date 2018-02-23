// Dependencies
let inquirer = require('inquirer')
let mysql = require('mysql')

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
  runManagerFunction();
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

function runManagerFunction() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'Select an option:',
        choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product',
        ],
        filter: function (val) {
          switch (val) {
            case 'View Products for Sale':
              return 'sale'
              break

            case 'View Low Inventory':
              return 'lowInventory'
              break

            case 'Add to Inventory':
              return 'addInventory'
              break

            case 'Add New Product':
              return 'newProduct'
              break

            default:
              console.log('ERROR: Unsupported Operation')
              exit(1)
          }
        },
      },
    ])
    .then(function (input) {
      switch (input.option) {
        case 'sale':
          displayInventory()
          break

        case 'lowInventory':
          displayLowInventory()
          break

        case 'addInventory':
          addInventory()
          break

        case 'newProduct':
          createNewProduct()
          break
      }
    })
}

// Pulls inventory from the Database
function displayInventory() {
  queryStr = 'SELECT * FROM products'

  connection.query(queryStr, function (err, data) {
    if (err) throw err
    console.log(
      'Existing Inventory: \n----------------------------------------\n'
    )

    let res = ''
    for (let i = 0; i < data.length; i++) {
      res = ''
      res += 'Item ID: ' + data[i].item_id + '\n'
      res += 'Product Name: ' + data[i].product_name + '\n'
      res += 'Department: ' + data[i].department + '\n'
      res += 'Price: $' + parseFloat(data[i].price).toFixed(2) + '\n'
      console.log(res + '\n----------------------------------------\n')
    }
    connection.end()
  })
}

// shows inventory that is below 5

function displayLowInventory() {
  queryStr = 'SELECT * FROM products WHERE stock_quantity < 5'

  connection.query(queryStr, function (err, data) {
    if (err) throw err

    console.log(
      'Low Inventory (quantity below 5) \n----------------------------------------\n'
    )

    let res = ''
    for (let i = 0; i < data.length; i++) {
      res = ''
      res += 'Item ID: ' + data[i].item_id + '\n'
      res += 'Product Name: ' + data[i].product_name + '\n'
      res += 'Department: ' + data[i].department + '\n'
      res += 'Price: $' + parseFloat(data[i].price).toFixed(2) + '\n'
      console.log(res + '\n----------------------------------------\n')
    }
    connection.end()
  })
}

function validateNumeric(value) {
  let number = typeof parseFloat(value) === 'number'
  let positive = parseFloat(value) > 0

  if (number && positive) {
    return true
  } else {
    return 'Please enter a positive number for unit price'
  }
}

//adds inventory
function addInventory() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'item_id',
        message: 'Please enter the item Id for stock quantity update',
        validate: validateNumber,
        filter: Number,
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to add?',
        validate: validateNumber,
        filter: Number,
      },
    ])
    .then(function (input) {
      let item = input.item_id
      let addQuantity = input.quantity
      let queryStr = 'SELECT * FROM products WHERE ?'

      connection.query(queryStr, { item_id: item }, function (err, data) {
        if (err) throw err
        if (data.length === 0) {
          console.log('ERROR: Invalid Item ID. Please enter a valid Item ID.')
          addInventory()
        } else {
          let productData = data[0]
          console.log('Updating Inventory...')
          let updateQueryStr =
            'UPDATE products SET stock_quantity = ' +
            (productData.stock_quantity + addQuantity) +
            ' WHERE item_id = ' +
            item

          connection.query(updateQueryStr, function (err, data) {
            if (err) throw err
            console.log(
              'Stock count for Item ID ' +
              item +
              ' has been updated to ' +
              (productData.stock_quantity + addQuantity) +
              '.\n----------------------------------------\n'
            )
            connection.end()
          })
        }
      })
    })
}

// function to create a new product
function createNewProduct() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'product_name',
        message: 'Enter the product name.',
      },
      {
        type: 'input',
        name: 'department_name',
        message: 'Which department is this for?',
      },
      {
        type: 'input',
        name: 'price',
        message: 'Enter the price.',
        validate: validateNumeric,
      },
      {
        type: 'input',
        name: 'stock_quantity',
        message: 'Enter the quantity',
        validate: validateNumber,
      },
    ])
    .then(function (input) {
      console.log(
        'Adding New Item: \n    product_name = ' +
        input.product_name +
        '\n' +
        '    department_name = ' +
        input.department_name +
        '\n' +
        '    price = ' +
        input.price +
        '\n' +
        '    stock_quantity = ' +
        input.stock_quantity
      )
      let queryStr = 'INSERT into products SET ?'

      connection.query(
        queryStr,
        {
          product_name: input.product_name,
          department: input.department_name,
          price: input.price,
          stock_quantity: input.stock_quantity,
        },
        function (err, results, fields) {
          if (err) throw err
          console.log(
            'A new product has been entered with this ID ' +
            results.insertId +
            '.\n----------------------------------------\n'
          )
          connection.end()
        }
      )
    })
}

