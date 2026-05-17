CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(20),
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE category_log (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(20),
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE pricing (
    pricing_id INT AUTO_INCREMENT PRIMARY KEY,
    pricing_name VARCHAR(20),
    pricing_discount_precentage DECIMAL(10, 0),
    pricing_effective_date DATE,
    pricing_expire_date DATE,
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE pricing_log (
    pricing_id INT AUTO_INCREMENT PRIMARY KEY,
    pricing_name VARCHAR(20),
    pricing_discount_precentage DECIMAL(10, 0),
    pricing_effective_date DATE,
    pricing_expire_date DATE,
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(20),
    product_is_service TINYINT,
    productbuying_price DOUBLE,
    productselling_price DOUBLE,
    category_id INT,
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
);

CREATE TABLE product_log (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(20),
    product_is_service TINYINT,
    productbuying_price DOUBLE,
    productselling_price DOUBLE,
    pricing_id INT,
    category_id INT,
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(20),
    supplier_contact DECIMAL(10, 0),
    supplier_company VARCHAR(30),
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE supplier_log (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(20),
    supplier_contact DECIMAL(10, 0),
    supplier_company VARCHAR(30),
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE stock (
    ref_id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT,
    supplier_id INT,
    product_id INT,
    category_id INT,
    quantity INT,
    date_stock DATE,
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    branch_id VARCHAR(45),
    version DECIMAL(10, 0),
    CONSTRAINT fk_stock_product FOREIGN KEY (product_id) REFERENCES product (product_id),
    CONSTRAINT fk_stock_supplier FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id),
    CONSTRAINT fk_stock_category FOREIGN KEY (category_id) REFERENCES category (category_id)
);

CREATE TABLE stock_log (
    ref_id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT,
    supplier_id INT,
    product_id INT,
    category_id INT,
    quantity INT,
    date_stock DATE,
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE product_pricing (
    ref_id INT AUTO_INCREMENT PRIMARY KEY,
    pricing_id INT NOT NULL,
    product_id INT NOT NULL,
    CONSTRAINT fk_pp_pricing FOREIGN KEY (pricing_id) REFERENCES pricing (pricing_id),
    CONSTRAINT fk_pp_product FOREIGN KEY (product_id) REFERENCES product (product_id)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_fname VARCHAR(45) NOT NULL,
    user_lname VARCHAR(45) NOT NULL,
    user_contact_number DECIMAL(11) NOT NULL,
    user_email VARCHAR(45) NOT NULL,
    user_address VARCHAR(105) NOT NULL,
    password_hash VARCHAR(255),
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0),
    UNIQUE KEY uk_user_name (user_name),
    UNIQUE KEY uk_user_email (user_email)
);

CREATE TABLE users_log (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_fname VARCHAR(45) NOT NULL,
    user_lname VARCHAR(45) NOT NULL,
    user_contact_number DECIMAL(11) NOT NULL,
    user_email VARCHAR(45) NOT NULL,
    user_address VARCHAR(105) NOT NULL,
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(45),
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0),
    UNIQUE KEY uk_role_name (role_name)
);

CREATE TABLE role_log (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(45),
    created_user VARCHAR(30) NOT NULL,
    created_date_time DATETIME NOT NULL,
    last_modified_user VARCHAR(30),
    last_modified_date_time DATETIME,
    version DECIMAL(10, 0)
);

CREATE TABLE permission (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(45),
    UNIQUE KEY uk_permission_name (permission_name)
);

CREATE TABLE permission_log (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(45)
);

CREATE TABLE user_role (
    ref_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES role (role_id)
);

CREATE TABLE role_permission (
    ref_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES role (role_id),
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permission (permission_id)
);

CREATE TABLE invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    product_name VARCHAR(45),
    quantity DOUBLE,
    line_total DOUBLE,
    total DOUBLE,
    version DECIMAL(10, 0)
);

CREATE TABLE product_invoice (
    ref_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    invoice_id INT NOT NULL,
    CONSTRAINT fk_pi_product FOREIGN KEY (product_id) REFERENCES product (product_id),
    CONSTRAINT fk_pi_invoice FOREIGN KEY (invoice_id) REFERENCES invoice (invoice_id)
);
