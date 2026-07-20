# eCommerce Store Fullstack

A simple fullstack eCommerce store built with a React + Vite frontend and an Express + MongoDB backend.

## Project Overview

This project includes two main parts:

- `backend/` - Express server with MongoDB, authentication, and product CRUD APIs.
- `frontend/` - React app using Vite, React Router, Axios, and Tailwind CSS.

The app lets users sign up / log in, browse products, filter by search and category, view product details, and manage products through an admin interface.

## Key Features

- User signup and login with password hashing and JWT token generation
- Product listing with search and category filtering
- Product details page
- Admin interfaces for adding, editing, and deleting products
- Separate frontend and backend codeWQbases for easier reuse and scaling

## How the Flow Works

### Backend

1. `backend/server.js` starts the Express app and connects to MongoDB.
2. API routes are mounted under `/api/auth` and `/api/products`.
3. Controllers handle the business logic:
   - `backend/controllers/auth.controller.js` handles signup and login.
   - `backend/controllers/product.controller.js` handles product create, read, update, and delete.
4. Models define the data schema:
   - `backend/models/user.model.js` for users.
   - `backend/models/product.model.js` for products.
5. `backend/config/database.js` connects to MongoDB using `process.env.MONGO_URI`.

### Frontend

1. `frontend/src/App.jsx` defines client routes with React Router.
2. `frontend/src/api/Axios.jsx` creates an Axios instance pointing at the backend API.
3. Pages and admin screens make requests to the backend and render the UI:
   - `frontend/src/pages/Home.jsx` displays products with search and category filters.
   - `frontend/src/pages/ProductDetails.jsx` shows a single product detail view.
   - `frontend/src/pages/Signup.jsx` creates a new user account.
   - `frontend/src/pages/Login.jsx` logs in a user and stores the JWT token.
   - `frontend/src/admin/ProductList.jsx` shows all products with edit/delete actions.
   - `frontend/src/admin/AddProduct.jsx` creates a new product.
   - `frontend/src/admin/EditProduct.jsx` updates an existing product.

## Installation

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in `backend/` with:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:

```bash
node --watch server.js
```

The backend listens on `http://localhost:5002`.

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend runs on Vite’s default port, usually `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /api/auth/signup` - create a new user
  - Body: `{ name, email, password }`
- `POST /api/auth/login` - log in
  - Body: `{ email, password }`

### Products

- `GET /api/products` - list products, optional query parameters:
  - `search` - partial search on title
  - `category` - filter by category
- `POST /api/products/add` - create a new product
- `PUT /api/products/update/:id` - update a product by ID
- `DELETE /api/products/delete/:id` - delete a product by ID

## Data Models

### User

- `name` - string, required
- `email` - string, required
- `password` - string, required

### Product

- `title` - string, required
- `description` - string
- `price` - number, required
- `category` - string
- `image` - string (URL)
- `stock` - number, defaults to `0`

## Notes

- The frontend currently stores a JWT token in `localStorage` after login, but routes are not fully protected yet.
- `ProductDetails.jsx` currently fetches all products and selects one by ID, so the page works without a dedicated `GET /api/products/:id` endpoint.
- The admin section is available at:
  - `/admin/products`
  - `/admin/products/add`
  - `/admin/products/edit/:id`

## Useful Commands

From `backend/`:

```bash
npm install
node --watch server.js
```

From `frontend/`:

```bash
npm install
npm run dev
```

## Libraries Used

- Backend: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`
- Frontend: `react`, `react-dom`, `react-router-dom`, `axios`, `vite`, `tailwindcss`

## Recommended Improvements

- Add route protection for admin actions.
- Implement dedicated product detail endpoint.
- Add a real shopping cart and checkout flow.
- Add form validation and better error handling.
- Use a shared `.env` documentation file or root README for environment setup.

## Future Changes / Notes



-when adding  a new backend feature, note the route, controller, model, and any new environment values.
- for frontend page or component, note the route, purpose, and which API endpoints it calls.



# cart done 
# address backend done , 
# address forntendd+checkout thing 