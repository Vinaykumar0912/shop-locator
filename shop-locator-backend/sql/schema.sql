

-- 1. USERS TABLE
-- Stores both shop owners and customers
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('owner', 'customer')) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. OTP VERIFICATIONS TABLE
-- Used for email + console OTP verification
CREATE TABLE otp_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SHOPS TABLE
-- One owner can have multiple shops
-- Location stored for map & distance features
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    shop_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ITEMS TABLE
-- Items belong to a shop
-- Quantity-based (no price)
-- 4. ITEMS TABLE (Updated)
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit_type VARCHAR(50),  -- Added this to match your form
    description TEXT,       -- Added this to match your form
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. RECENT SEARCHES TABLE
-- Stores recently searched items for customers
CREATE TABLE recent_searches (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- INDEXES (Performance Optimization)
-- ================================

-- Fast item search
CREATE INDEX idx_items_item_name ON items(item_name);

-- Faster shop location queries
CREATE INDEX idx_shops_location ON shops(latitude, longitude);

-- Faster recent searches lookup
CREATE INDEX idx_recent_searches_customer ON recent_searches(customer_id);
