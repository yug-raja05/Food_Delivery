# 🍲 Zion Food Corner - Full-Stack Modern Food Delivery & Restaurant Platform

A full-stack food delivery, dine-in, and culinary showcase web application for **Zion Food Corner** (S R Nagar, Bengaluru). Built with a modern **React + Vite** single-page application frontend, custom CSS design system, **Node.js / Express.js** REST API backend, and **MongoDB Atlas** database.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features & User Experience](#-key-features--user-experience)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [Environment Configuration](#-environment-configuration)
6. [Installation & Setup](#-installation--setup)
7. [Running Locally](#-running-locally)
8. [Database Seeding](#-database-seeding)
9. [REST API Documentation](#-rest-api-documentation)
10. [Cart, Checkout & Pricing Architecture](#-cart-checkout--pricing-architecture)
11. [Live Rating System](#-live-rating-system)

---

## 📖 Project Overview

**Zion Food Corner** delivers a high-speed, interactive food ordering experience:
- Customers can explore fast-food and authentic Indian specialties (Biryani, Fried Rice, Noodles, Tandoor & Curries).
- Watch real-time high-definition video recipes and interactive step-by-step cooking timelines.
- Real-time rating aggregation calculated directly from customer reviews in MongoDB.
- Full checkout flow with dynamic steppers, special cooking instructions, quick-add pairings, delivery tipping, coupon validation, and instant order tracking.

---

## ✨ Key Features & User Experience

### 1. 🍽️ Dynamic Menu & Smart Discovery
- **Instant Search & Category Filtering:** Instant search by dish name, spice level, or ingredients across categories (`Rice & Biryani`, `Fried Rice`, `Noodles`, `Chicken Items`, `Veg Items`, `Indian Favourites`).
- **Dietary Indicators:** Clean Veg / Non-Veg badges with green and red dietary icons.
- **Recipe & Cooking Player:** Cinematic video preview modal with interactive cooking steps, spice levels, chef techniques, and ingredient lists.

### 2. 🛒 Interactive Cart Experience (`/cart`)
- **Quantity Steppers & Deletion:** Intuitive `-` and `+` steppers with live total updates.
- **Custom Cooking Instructions:** Expandable cooking note per dish (*e.g., "Less spicy", "No onions", "Extra green chutney"*).
- **Free Delivery Milestone Meter:** Gamified progress bar highlighting amount needed to unlock **FREE Delivery** ($\ge ₹250$).
- **Frequently Ordered Together:** Quick-add pairings for chilled beverages (*Thums Up Can*), fresh breads (*Butter Naan*), desserts (*Hot Gulab Jamun*), and starters.
- **Delivery Partner Tips:** Tipping selection chips ($\text{₹10}, \text{₹20}, \text{₹30}, \text{₹50}$).
- **Coupon Vouchers:** 1-click apply promo codes (`ZION50`, `WELCOME10`, `BIRYANI20`) with instant savings badge.

### 3. 🚀 Streamlined Checkout Flow (`/checkout`)
- **3-Step Order Progress Stepper:**
  $$\text{1. My Cart} \longrightarrow \text{2. Delivery Details} \longrightarrow \text{3. Order Confirmed}$$
- **Payment Methods:** Support for **💵 Cash on Delivery (COD)** and **📲 UPI / QR Code on Delivery**.
- **Accurate Bill Receipt:** Guaranteed snapshot calculations showing exact non-zero bill totals, order reference ID, and kitchen preparation ETA (**30–40 Mins**).

### 4. 👤 Authentication & User Profile
- JWT-based authentication with instant register/login modals.
- Persistent session storage in `localStorage`.
- High-contrast initials avatar card with active status badge, cart indicator, and **click-outside-to-close** dismissal.

### 5. ⭐ Live Rating System
- Automatically computes live average ratings and star breakdowns from MongoDB feedback submissions.
- Dynamic display in Hero banner, Location info card, and Diners' Voice dashboard without requiring page reloads.

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router 6, Vite, Context API, Vanilla CSS Design System, Font Awesome 6, Google Fonts (*Outfit*, *Plus Jakarta Sans*) |
| **Backend** | Node.js, Express.js, Mongoose ODM, JSON Web Tokens (JWT), bcryptjs, Helmet, CORS, Morgan, Express-Rate-Limit |
| **Database** | MongoDB Atlas (Cloud) / Local MongoDB (`zion_food_corner`) |

---

## 📂 Project Structure

```
d:\bussiness\1st\
├── backend/                       # 🟢 Express + MongoDB REST API Backend
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js      # User registration, login, profile
│   │   ├── categoryController.js  # Menu categories
│   │   ├── couponController.js    # Coupon verification & validation
│   │   ├── feedbackController.js  # Feedback reviews & live stats calculation
│   │   ├── menuController.js      # Dishes, search, popular filter
│   │   ├── orderController.js     # Order creation & status update
│   │   └── restaurantController.js# Restaurant profile & hours
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   └── errorHandler.js        # Centralized error handler
│   ├── models/                    # Category, Coupon, Feedback, MenuItem, Order, Restaurant, User
│   ├── routes/                    # API route declarations
│   ├── seed/                      # Initial database seed scripts
│   ├── utils/                     # Order ID generator helpers
│   ├── .env                       # Backend environment secrets
│   ├── package.json
│   └── server.js                  # Main server entrypoint (Port 5000)
│
├── frontend/                      # 🔵 React + Vite Single Page Application
│   ├── css/
│   │   └── styles.css             # Comprehensive CSS Design System & Layout Tokens
│   ├── src/
│   │   ├── components/            # Navbar, Hero, MenuSection, About, Location, Feedback, Footer, Modals
│   │   ├── context/               # CartContext, AuthContext, ToastContext, CookingModalContext
│   │   ├── data/
│   │   │   └── constants.js       # Default menu items, categories, coupons & restaurant info
│   │   ├── pages/                 # Home.jsx, Cart.jsx, Checkout.jsx, MenuPage.jsx, NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js             # Centralized ApiClient fetch wrapper
│   │   ├── App.jsx                # Route definitions
│   │   ├── index.css              # React transitions & reset
│   │   └── main.jsx               # React DOM entrypoint
│   ├── index.html                 # Vite HTML entry template
│   ├── vite.config.js             # Vite config with /api proxy to Port 5000
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Configuration

### Backend Environment (`backend/.env`)
Create or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/zion_food_corner?retryWrites=true&w=majority
JWT_SECRET=zion_food_corner_super_secret_jwt_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### Frontend Environment (`frontend/.env`)
```env
VITE_API_BASE_URL=/api
```

---

## 🚀 Installation & Setup

### 1. Clone & Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Database Seeding (Optional / Initial Setup)
Populate MongoDB Atlas with default dishes, categories, coupons, and sample reviews:
```bash
cd backend
npm run seed
```

---

## 💻 Running Locally

Run both servers concurrently:

### Terminal 1: Backend Server (Port 5000)
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend Dev Server (Port 5173)
```bash
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 REST API Documentation

### 🍕 Menu & Categories
- `GET /api/categories` — Get all menu categories
- `GET /api/menu` — Get all active menu items
- `GET /api/menu/popular` — Get highlighted bestselling dishes
- `GET /api/menu/search?q=:query` — Real-time search dishes

### 🏷️ Coupons & Pricing
- `GET /api/coupons` — List available coupons
- `POST /api/coupons/validate` — Validate promo code and compute discount

### 📦 Orders
- `POST /api/orders` — Place order with server-side price verification
- `GET /api/orders/:orderNumber` — Retrieve order receipt details
- `PATCH /api/orders/:orderNumber/status` — Update order status

### 💬 Customer Feedback & Live Ratings
- `GET /api/feedback` — Fetch customer reviews
- `GET /api/feedback/stats` — Fetch live aggregated rating and review count
- `POST /api/feedback` — Submit a new verified diner review

### 🔐 Authentication
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Sign in with email & password
- `GET /api/auth/me` — Get authenticated user details
- `PUT /api/auth/profile` — Update user profile

---

## 💰 Cart, Checkout & Pricing Architecture

All order calculations follow strict rules:
$$\text{Item Subtotal} = \sum (\text{Price} \times \text{Quantity})$$
$$\text{GST} = \text{Subtotal} \times 5\%$$
$$\text{Packaging Charge} = ₹15$$
$$\text{Delivery Fee} = \begin{cases} 0 & \text{if Subtotal} \ge ₹250 \\ ₹25 & \text{otherwise} \end{cases}$$
$$\text{Grand Total} = \max(0, \text{Subtotal} - \text{Discount} + \text{GST} + \text{Packaging} + \text{Delivery} + \text{Tip})$$

---

## 📍 Restaurant Location & Contact
- **Address:** 45, 4th Main Rd, Corporation, Ashwath Nagar, Sampangi Rama Nagara, S R Nagar, Bengaluru, Karnataka 560027
- **Phone:** `098867 64280`
- **Hours:** 11:00 AM – 11:00 PM (Daily)
