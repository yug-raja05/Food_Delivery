# 🍲 Zion Food Corner - Full-Stack Restaurant Ordering Application

A modern, full-stack restaurant ordering and culinary showcase application for **Zion Food Corner**. Built with high-performance Vanilla JavaScript, CSS design systems, an Express.js/Node.js backend, and MongoDB Atlas database.

---

## 📌 Table of Contents
1. [Project Description](#-project-description)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Folder Structure](#-folder-structure)
5. [MongoDB Atlas Setup](#-mongodb-atlas-setup)
6. [Environment Variables](#-environment-variables)
7. [Installation & Setup](#-installation--setup)
8. [Database Seeding](#-database-seeding)
9. [Running the Application](#-running-the-application)
10. [REST API Documentation](#-rest-api-documentation)
11. [Order Creation Flow & Pricing Verification](#-order-creation-flow--pricing-verification)
12. [Asset Management (Images & Videos)](#-asset-management-images--videos)
13. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 📖 Project Description

**Zion Food Corner** is a full-featured web application that allows customers to explore delicious menus, view real-time cooking steps and videos, filter items by categories and dietary preferences (Veg/Non-Veg), calculate delivery and coupon discounts, and place orders for Takeaway, Home Delivery, or Dine-In with server-side validation.

---

## ✨ Key Features

- **Full-Featured Restaurant Homepage:** Dynamic hero section, operational hours ticker, ratings, location card, and kitchen gallery.
- **Dynamic Menu & Filtering:**
  - Real-time search by dish title and description.
  - Category filtering (`Rice & Biryani`, `Fried Rice`, `Noodles`, `Chicken Items`, `Veg Items`, `Indian Favourites`).
  - Dietary toggles for Pure Veg and Non-Veg dishes.
  - Popular dish highlight cards with quantity steppers.
- **Realtime Cinematic Cooking Player:**
  - Video preview with live HUD overlay.
  - Interactive cooking step timeline and instructions.
  - Spice level, technique, cooking time, and ingredient list badges.
- **Cart & Pricing Engine:**
  - Temporary client-side cart synchronization using `localStorage`.
  - Free delivery progress tracker (Free delivery on orders $\ge$ ₹250, otherwise ₹25).
  - Fixed packaging fee (₹15) and GST (5%).
  - Real-time coupon discounts validated server-side (`ZION50`, `WELCOME10`, `BIRYANI20`).
- **3 Order Modes:**
  - **Takeaway:** Customer Name & Phone Number.
  - **Home Delivery:** Customer Name, Phone Number, Delivery Address, Landmark, Pincode.
  - **Dine-In:** Customer Name, Phone Number, Table Number.
- **Security & Integrity:**
  - Backend is the absolute source of truth for pricing and coupons.
  - Security headers with `helmet`, CORS protection, and request rate-limiting with `express-rate-limit`.
  - Backend generation of unique order IDs (e.g. `ZFC-20261002-0001`).

---

## 🛠 Tech Stack

- **Frontend:**
  - HTML5 (Semantic structure, SEO meta tags, OpenGraph)
  - CSS3 (Custom design system tokens, responsive grid, micro-animations, glassmorphism)
  - Vanilla JavaScript (ES6+ modular structure, Fetch API)
  - Font Awesome 6.4.0 & Google Fonts (Outfit, Plus Jakarta Sans)
- **Backend:**
  - Node.js & Express.js
  - Mongoose ODM
  - CORS, Helmet, Morgan, Express-Rate-Limit, Dotenv
- **Database:**
  - MongoDB Atlas / Local MongoDB (`zion_food_corner`)

---

## 📂 Folder Structure

```
zion-food-corner/
├── frontend/
│   ├── index.html                  # Main landing and menu page
│   ├── cart.html                   # Cart and checkout page
│   ├── css/
│   │   └── styles.css              # Unified design system & responsive styling
│   ├── js/
│   │   ├── api.js                  # Frontend API client library
│   │   ├── cart-manager.js         # Client-side cart state & localStorage helpers
│   │   ├── app.js                  # Homepage logic (menu rendering, filters, video modal)
│   │   └── cart.js                 # Cart & checkout controller, backend order submission
│   └── assets/
│       ├── images/
│       │   ├── hero/               # Hero section images
│       │   ├── menu/               # Food & dish photographs
│       │   ├── kitchen/            # Kitchen & preparation gallery
│       │   └── about/              # About us section images
│       └── videos/
│           └── menu/               # Dish cooking videos & clips
├── backend/
│   ├── package.json
│   ├── server.js                   # Main Express application entrypoint
│   ├── .env                        # Environment variables (do not commit secrets)
│   ├── .env.example                # Example environment configuration
│   ├── config/
│   │   └── db.js                   # MongoDB connection configuration
│   ├── models/
│   │   ├── Restaurant.js           # Restaurant information schema
│   │   ├── Category.js             # Menu category schema
│   │   ├── MenuItem.js             # Menu item, recipe steps, & ingredients schema
│   │   ├── Coupon.js               # Discount coupon schema
│   │   └── Order.js                # Customer order schema
│   ├── controllers/
│   │   ├── restaurantController.js
│   │   ├── categoryController.js
│   │   ├── menuController.js
│   │   ├── couponController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── restaurantRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── couponRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── errorMiddleware.js      # Global error handling and 404 catcher
│   ├── utils/
│   │   └── generateOrderId.js      # Safe format unique Order ID generator
│   └── seed/
│       └── menuSeed.js             # Initial database migration/seeding script
├── .gitignore
└── README.md
```

---

## ☁️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in / create an account.
2. Create a new Cluster (Free Shared Tier M0 is sufficient).
3. Under **Database Access**, create a database user with read/write privileges.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (or your specific server IP).
5. In your cluster dashboard, click **Connect** $\rightarrow$ **Drivers** (Node.js) and copy the connection string.
6. Replace `<password>` with your database user password and specify the database name `zion_food_corner`:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/zion_food_corner?retryWrites=true&w=majority
   ```

---

## ⚙️ Environment Variables

Create a file named `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/zion_food_corner?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5500
NODE_ENV=development
```

*(Note: If running locally without Atlas, set `MONGODB_URI=mongodb://127.0.0.1:27017/zion_food_corner`)*.

---

## 🚀 Installation & Setup

### 1. Install Backend Dependencies
Open your terminal in the `backend/` directory:
```bash
cd backend
npm install
```

---

## 🌱 Database Seeding

Populate MongoDB with the restaurant details, menu categories, 14 rich dishes with cooking steps/ingredients/videos, and coupons:

```bash
cd backend
npm run seed
```

Output:
```
Connected to MongoDB for seeding.
Cleared existing records.
Seeded Restaurant Information.
Seeded 6 Categories.
Seeded 14 Menu Items.
Seeded 3 Coupons.
=========================================
DATABASE SEEDED SUCCESSFULLY!
=========================================
```

---

## 💻 Running the Application

### 1. Start the Backend API Server
In the `backend/` directory:
```bash
# Development mode with Nodemon auto-reloading:
npm run dev

# Or standard production mode:
npm start
```
The server will start on `http://localhost:5000`.

### 2. Launch the Frontend
You can run the frontend using any local HTTP server:
- **VS Code Live Server:** Right click `frontend/index.html` $\rightarrow$ *Open with Live Server* (default: `http://localhost:5500`).
- **Node `http-server` / `serve`:**
  ```bash
  npx serve frontend -p 5500
  ```
- **Integrated Express Static Serving:**
  The Express backend is also configured to serve the `frontend/` directory statically on `http://localhost:5000/`.

---

## 📡 REST API Documentation

### Base URL: `http://localhost:5000/api`

### 1. Restaurant
- `GET /api/restaurant` — Fetch restaurant info, timings, address, hero description.

### 2. Categories
- `GET /api/categories` — Fetch all active food categories.

### 3. Menu Items
- `GET /api/menu` — Fetch all available menu items (supports query filters `?category=biryani&isVeg=true&search=chicken`).
- `GET /api/menu/popular` — Fetch popular / chef recommended items.
- `GET /api/menu/category/:category` — Fetch items belonging to a specific category.
- `GET /api/menu/search?q=query` — Search dishes by keyword.
- `GET /api/menu/:id` — Fetch full details of a specific dish including ingredients and cooking steps.

### 4. Coupons
- `POST /api/coupons/validate` — Validate promo code and calculate discount.
  ```json
  // Request
  { "code": "ZION50", "subtotal": 500 }
  // Response
  {
    "success": true,
    "data": {
      "code": "ZION50",
      "discount": 75,
      "description": "50% OFF up to ₹75"
    }
  }
  ```

### 5. Orders
- `POST /api/orders` — Create and store a customer order with server-side recalculation.
  ```json
  // Request
  {
    "customer": { "name": "Aman Sharma", "phone": "9876543210" },
    "orderType": "delivery",
    "deliveryAddress": { "address": "Flat 402, Royal Palms", "landmark": "Near Lake", "pincode": "751024" },
    "items": [
      { "menuItemId": "670c...", "quantity": 2 }
    ],
    "couponCode": "ZION50",
    "cookingInstructions": "Less spicy please",
    "paymentMethod": "cod"
  }
  ```
- `GET /api/orders/:orderNumber` — Retrieve order receipt details by order number.
- `PATCH /api/orders/:orderNumber/status` — Update order progress (`pending`, `confirmed`, `preparing`, `ready`, `out_for_delivery`, `completed`, `cancelled`).

---

## 🔒 Order Creation Flow & Pricing Verification

```
User selects dishes
       ↓
cart-manager.js maintains local cart
       ↓
Customer clicks "Place Order" (cart.js)
       ↓
POST /api/orders
       ↓
Backend retrieves exact item prices from MongoDB (MenuItem)
       ↓
Backend calculates:
  • Subtotal = Σ (Database Price × Quantity)
  • Delivery Fee = Subtotal < 250 ? ₹25 : ₹0 (Free)
  • Packaging Fee = ₹15
  • Coupon Discount = Validated server-side against minOrder & limits
  • GST / Tax = 5% of Subtotal
  • Grand Total = Subtotal + Tax + DeliveryFee + PackagingFee - Discount
       ↓
Order document saved to MongoDB with unique ID: ZFC-YYYYMMDD-XXXX
       ↓
Backend returns order confirmation JSON
       ↓
Frontend clears localStorage cart & shows Success Receipt Modal
```

---

## 🖼️ Asset Management (Images & Videos)

- **Static Images & Icons:**
  - Place hero graphics in `frontend/assets/images/hero/`.
  - Place dishes in `frontend/assets/images/menu/`.
  - Place kitchen photos in `frontend/assets/images/kitchen/`.
  - Place restaurant photos in `frontend/assets/images/about/`.
- **Cooking Videos:**
  - Store MP4 clips in `frontend/assets/videos/menu/`.
- **Dynamic URLs:**
  - The `MenuItem` schema stores image and video URLs as strings (`image`, `videoUrl`, `videoPoster`), making it fully compatible with CDNs, Cloudinary, AWS S3, or local asset paths (`assets/images/...`).

---

## ❓ Troubleshooting & FAQs

1. **CORS Error in Browser Console:**
   Ensure `backend/.env` has `CLIENT_URL` set to the exact port your frontend is served from (e.g. `http://localhost:5500` or `http://127.0.0.1:5500`).
2. **MongoDB Connection Failed (`MongooseServerSelectionError`):**
   - Check your network connectivity.
   - Verify that your IP is whitelisted under **Network Access** in MongoDB Atlas (`0.0.0.0/0`).
   - Check that username and password are correctly encoded in `MONGODB_URI`.
3. **Cart items not displaying:**
   Verify the backend is running (`npm start`) and the API URL is reachable at `http://localhost:5000/api/menu`.

---

## 📜 License
© Zion Food Corner. All rights reserved.
