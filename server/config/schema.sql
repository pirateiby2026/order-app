-- Menus 테이블
CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image VARCHAR(500),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE IF NOT EXISTS options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
  menu_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- Orders 테이블
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'received', 'preparing', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order_Items 테이블
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  menu_id INTEGER NOT NULL,
  menu_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  item_price INTEGER NOT NULL CHECK (item_price >= 0),
  total_price INTEGER NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL
);

-- Order_Item_Options 테이블
CREATE TABLE IF NOT EXISTS order_item_options (
  id SERIAL PRIMARY KEY,
  order_item_id INTEGER NOT NULL,
  option_id INTEGER NOT NULL,
  option_name VARCHAR(255) NOT NULL,
  option_price INTEGER NOT NULL CHECK (option_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE SET NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_time ON orders(order_time DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_options_menu_id ON options(menu_id);
