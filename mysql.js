CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
    )
    
INSERT into products (product_name, department_name, price, stock_quantity)
VALUES 
("Nano Ledger", "technology", 59.99, 100),
("Nerf Gun", "toys", 19.99, 200),
("Office Chair", "office", 39.99, 300),
("Coffee Maker", "kitchen", 29.99, 400),
("20 Sided Dice", "toys", 9.99, 500),
("50 LCD TV", "electronics", 299.99, 600),
("Nike Shoes", "shoes", 99.98, 700),
("Iphone X", "phones", 999.99, 800),
("Phone Charger", "phones", 4.99, 900),
("Oakley Sunglasses", "sunglasses", 89.99, 1000)



SELECT * FROM products;
    
    
    