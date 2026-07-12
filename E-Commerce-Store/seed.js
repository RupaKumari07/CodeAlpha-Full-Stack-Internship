const db = require('./db');

const products = [
  { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.', price: 79.99, category: 'Electronics', stock: 25, image_url: 'https://loremflickr.com/400/400/headphones?random=1' },
  { name: 'Running Shoes', description: 'Lightweight, breathable running shoes with responsive cushioning.', price: 129.99, category: 'Sports', stock: 40, image_url: 'https://loremflickr.com/400/400/shoes?random=2' },
  { name: 'Leather Backpack', description: 'Handcrafted genuine leather backpack with laptop compartment.', price: 89.99, category: 'Accessories', stock: 15, image_url: 'https://loremflickr.com/400/400/backpack?random=3' },
  { name: 'Smart Watch', description: 'Fitness tracker with heart rate monitor, GPS, and 7-day battery.', price: 199.99, category: 'Electronics', stock: 20, image_url: 'https://loremflickr.com/400/400/watch?random=4' },
  { name: 'Cotton T-Shirt', description: 'Soft 100% organic cotton t-shirt, available in multiple colors.', price: 24.99, category: 'Clothing', stock: 100, image_url: 'https://loremflickr.com/400/400/tshirt?random=5' },
  { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with deep bass and 12hr playtime.', price: 49.99, category: 'Electronics', stock: 35, image_url: 'https://loremflickr.com/400/400/speaker?random=6' },
  { name: 'Coffee Maker', description: 'Programmable 12-cup drip coffee maker with thermal carafe.', price: 64.99, category: 'Home', stock: 18, image_url: 'https://loremflickr.com/400/400/coffee?random=7' },
  { name: 'Yoga Mat', description: 'Extra thick non-slip yoga mat with carrying strap.', price: 34.99, category: 'Sports', stock: 50, image_url: 'https://loremflickr.com/400/400/yoga?random=8' },
  { name: 'Sunglasses', description: 'Polarized UV400 protection aviator sunglasses.', price: 59.99, category: 'Accessories', stock: 30, image_url: 'https://loremflickr.com/400/400/sunglasses?random=9' },
  { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with Cherry MX switches.', price: 119.99, category: 'Electronics', stock: 22, image_url: 'https://loremflickr.com/400/400/keyboard?random=10' },
  { name: 'Denim Jacket', description: 'Classic denim jacket with a modern slim fit.', price: 74.99, category: 'Clothing', stock: 12, image_url: 'https://loremflickr.com/400/400/jacket?random=11' },
  { name: 'Stainless Water Bottle', description: 'Vacuum insulated 32oz bottle, keeps drinks cold 24hrs.', price: 29.99, category: 'Home', stock: 60, image_url: 'https://loremflickr.com/400/400/bottle?random=12' },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO products (name, description, price, image_url, category, stock)
  VALUES (@name, @description, @price, @image_url, @category, @stock)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) {
    insert.run(item);
  }
});

insertMany(products);
console.log('Database seeded with sample products.');
