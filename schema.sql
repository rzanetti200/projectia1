CREATE TABLE trades(
   id   INT              NOT NULL AUTO_INCREMENT,
   coin VARCHAR (100)     NOT NULL,
   quantity DECIMAL(18, 2)             NOT NULL,
   fee DECIMAL(18, 2) NOT NULL,
   volotility  DECIMAL (18, 2) NOT NULL,
   price      DECIMAL (18, 2) NOT NULL,  
   is_deleted INT DEFAULT 0,
   PRIMARY KEY (id)
);

INSERT INTO trades (coin, quantity, fee, volotility, price) VALUES ('BTC', 5, 5.5, .05, 100000);