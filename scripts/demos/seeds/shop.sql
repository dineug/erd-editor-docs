CREATE TABLE members (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Member ID',
  email VARCHAR(255) NOT NULL COMMENT 'Login email',
  nickname VARCHAR(50) NOT NULL COMMENT 'Display name',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Joined at',
  PRIMARY KEY (id)
) COMMENT 'Registered users';

CREATE TABLE addresses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  line1 VARCHAR(255) NOT NULL COMMENT 'Street address',
  PRIMARY KEY (id)
) COMMENT 'Shipping addresses';

CREATE TABLE categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Product categories';

CREATE TABLE products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) COMMENT 'Catalog items';

CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ordered_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Customer orders';

CREATE TABLE order_items (
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
) COMMENT 'Order lines';

CREATE TABLE payments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  method VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_at DATETIME NULL,
  PRIMARY KEY (id)
) COMMENT 'Payment records';

CREATE TABLE reviews (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  member_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  body TEXT NULL,
  PRIMARY KEY (id)
) COMMENT 'Product reviews';

ALTER TABLE addresses ADD CONSTRAINT FK_members_TO_addresses FOREIGN KEY (member_id) REFERENCES members (id);
ALTER TABLE products ADD CONSTRAINT FK_categories_TO_products FOREIGN KEY (category_id) REFERENCES categories (id);
ALTER TABLE orders ADD CONSTRAINT FK_members_TO_orders FOREIGN KEY (member_id) REFERENCES members (id);
ALTER TABLE order_items ADD CONSTRAINT FK_orders_TO_order_items FOREIGN KEY (order_id) REFERENCES orders (id);
ALTER TABLE order_items ADD CONSTRAINT FK_products_TO_order_items FOREIGN KEY (product_id) REFERENCES products (id);
ALTER TABLE payments ADD CONSTRAINT FK_orders_TO_payments FOREIGN KEY (order_id) REFERENCES orders (id);
ALTER TABLE reviews ADD CONSTRAINT FK_products_TO_reviews FOREIGN KEY (product_id) REFERENCES products (id);
ALTER TABLE reviews ADD CONSTRAINT FK_members_TO_reviews FOREIGN KEY (member_id) REFERENCES members (id);
