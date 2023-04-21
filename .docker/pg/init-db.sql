CREATE TABLE
    IF NOT EXISTS carrier_quotation (
        id SERIAL PRIMARY KEY,
        shipping_company VARCHAR(255) NOT NULL,
        price FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW ()
    )