DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    price DECIMAL(13,2) NOT NULL,
    stock_quantity DECIMAL,
    PRIMARY KEY (item_id)
    );

    
    
    