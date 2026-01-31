# E-NexStore — ShopHub (E-commerce Boilerplate)

**Repository:** https://github.com/FaizanAhmeddd27/E-NexStore


##  Overview

E-NexStore is a full-stack e-commerce web application built with a modern React frontend and a Node/Express + MongoDB backend. It includes an admin dashboard, product management, cart and checkout flows (Stripe integration), coupons, order history, and Redis-powered featured product caching.

This README explains how to clone, configure, and run the project locally and how to use the admin coupon features you requested.


---

## ✨ Key Features

- User Authentication (signup/login/logout)
- Product catalog (category filters, featured & recommended)
- Cart management (add, remove, update quantity)
- Checkout using Stripe (create checkout sessions, success webhook handling)
- Orders & order history (view orders and order details)
- Coupons (create, validate, apply discount on checkout)
- Admin dashboard
  - Create / Update / Delete products
  - Toggle featured products (cached via Redis)
  - Manage coupons (create/delete from UI)
- Cloudinary image uploads for products and avatars
- Redis (Upstash) caching for featured products


---

## 🧰 Tech Stack

- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, React Router, Framer Motion
- Backend: Node.js, Express, Mongoose (MongoDB)
- Payments: Stripe
- Images: Cloudinary
- Cache: Upstash Redis (optional)
- HTTP Client: Axios


---

## Prerequisites

- Node.js (v18+ recommended) and npm
- MongoDB (Atlas or local) — a connection string
- Stripe account (for test keys)
- Cloudinary account (optional, for image uploads)
- (Optional) Upstash Redis account for caching featured products


---

## 🔧 Clone & Setup

```bash
git clone https://github.com/FaizanAhmeddd27/E-NexStore.git
cd E-NexStore
```

There are two separate projects: `server/` (API) and `client/` (React UI). Install dependencies and configure both.

### Server (API)

1. Install:

```bash
cd server
npm install
```

2. Create a `.env` file (example below) and fill values:

```env
# server/.env (example)
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/e-nexstore?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # for production webhook verification
STRIPE_API_VERSION=2023-08-16  # optional

# Cloudinary (uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Redis (optional - Upstash)
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...
```

3. Start server (development):

```bash
npm run dev
```

Or start production (after building client and setting envs):

```bash
npm start
```


### Client (React)

1. Install:

```bash
cd ../client
npm install
```

2. Create a `.env` file in `client/` (example):

```env
# client/.env
VITE_API_URL=http://localhost:5000/api
VITE_CLIENT_URL=http://localhost:5173
```

3. Run dev server:

```bash
npm run dev
```

Open the app at the address Vite prints (usually http://localhost:5173).


---

## Payment & Webhooks (Stripe testing)

- Use Stripe test keys for `STRIPE_SECRET_KEY`.
- To test webhook flows locally (recommended) use the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Keep an eye on `STRIPE_WEBHOOK_SECRET` (you’ll get it from the Stripe CLI and set it in `.env`).


---

## Admin — Coupons Management

- Admin users can manage coupons via the Admin Dashboard → Coupons tab.
- Endpoints (protected, admin-only):
  - GET `/api/admin/coupons` — list coupons
  - POST `/api/admin/coupons` — create coupon (body: `code`, `discountPercentage`, `expirationDate`, optional `maxUses`)
  - DELETE `/api/admin/coupons/:id` — delete coupon

Coupons are validated at checkout (`/api/payment/validate-coupon`) and are applied to Stripe sessions so discounts show on invoices and stored on `Order` documents.


---

## API Overview (selected)

- Auth
  - POST `/api/auth/signup` (multipart: optional `avatar`)
  - POST `/api/auth/login`
  - GET `/api/auth/profile` (protected)

- Products
  - GET `/api/products/` — all products
  - GET `/api/products/category/:category`
  - GET `/api/products/featured` — cached
  - POST `/api/products/` — create (admin)
  - PUT `/api/products/:id` — update (admin)
  - DELETE `/api/products/:id` — delete (admin)

- Cart
  - GET `/api/cart/` — get user's cart (protected)
  - POST `/api/cart/` — add to cart
  - PUT `/api/cart/:productId` — update qty
  - DELETE `/api/cart/:productId` — remove

- Payment & Orders
  - POST `/api/payment/create-checkout-session` — start Stripe session (protected)
  - POST `/api/payment/checkoutr-success` — handle checkout success (Stripe webhook also processes orders)
  - POST `/api/payment/validate-coupon` — check coupon validity (protected)
  - GET `/api/payment/orders` — user order history (protected)
  - GET `/api/payment/orders/:orderId` — order details (protected)

- Admin
  - GET `/api/admin/coupons` — list
  - POST `/api/admin/coupons` — create
  - DELETE `/api/admin/coupons/:id` — delete


---

## Common Troubleshooting

- "Could not connect to MongoDB" — double-check `MONGO_URI` and network access (Atlas IP access list).
- Stripe: if webhooks are not firing locally, run `stripe listen` and forward to `/api/payment/webhook`.
- CORS: ensure `CLIENT_URL` matches the URL where your client runs.
- Missing Cloudinary keys → image upload will fail.


---

## Contributing

Contributions are welcome. Typical workflow:

1. Fork the repo
2. Create a feature branch
3. Commit and push
4. Open a pull request with a description of the change

Please run linters and ensure there are no breaking changes when possible.


---

## License

This project is provided as-is. Add a license file (e.g., MIT) if you want to make the license explicit.


---

## Contact

If you need help or want extra features (e.g., invoice/pdf export, reorder from order details, coupon editing, or tests), open an issue or reach out via the repository.

Happy hacking! ⚡️
