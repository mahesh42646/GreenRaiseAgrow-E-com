# GreenRaise Backend API

This is the backend API for the GreenRaise e-commerce platform.

## Setup

1. Make sure MongoDB is installed and running.
2. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=2999
   MONGODB_URI=mongodb://localhost:27017/greenraise
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm run server
   ```

## API Endpoints

### Products
- `GET /api/ecom/products` - Get all products
- `GET /api/ecom/products/:id` - Get a single product by ID
- `POST /api/ecom/products` - Create a new product
- `PUT /api/ecom/products/:id` - Update a product
- `DELETE /api/ecom/products/:id` - Delete a product
- `POST /api/ecom/products/:id/reviews` - Add a review to a product

### Blogs
- `GET /api/ecom/blogs` - Get all blogs
- `GET /api/ecom/blogs/:identifier` - Get a single blog by ID or slug
- `POST /api/ecom/blogs` - Create a new blog
- `PUT /api/ecom/blogs/:id` - Update a blog
- `DELETE /api/ecom/blogs/:id` - Delete a blog
- `POST /api/ecom/blogs/:id/comments` - Add a comment to a blog

### User Profile
- `GET /api/ecom/profile/:userId` - Get user profile
- `PUT /api/ecom/profile/:userId` - Update user profile
- `POST /api/ecom/profile/:userId/addresses` - Add address to user profile
- `GET /api/ecom/profile/:userId/cart` - Get user cart
- `POST /api/ecom/profile/:userId/cart` - Add product to cart
- `GET /api/ecom/profile/:userId/wishlist` - Get user wishlist
- `POST /api/ecom/profile/:userId/wishlist` - Add product to wishlist

### Contact
- `POST /api/ecom/contact` - Submit a contact form
- `GET /api/ecom/contact` - Get all contact submissions (admin only)
- `GET /api/ecom/contact/:id` - Get a single contact by ID (admin only)
- `PUT /api/ecom/contact/:id` - Update contact status and add response (admin only)

## Socket.IO Events

The API uses Socket.IO for real-time updates. Here are the available events:

### Products
- `products:fetch` - Emitted when products are fetched
- `product:view` - Emitted when a product is viewed
- `product:created` - Emitted when a product is created
- `product:updated` - Emitted when a product is updated
- `product:deleted` - Emitted when a product is deleted
- `product:review:added` - Emitted when a review is added to a product

### Blogs
- `blogs:fetch` - Emitted when blogs are fetched
- `blog:view` - Emitted when a blog is viewed
- `blog:created` - Emitted when a blog is created
- `blog:updated` - Emitted when a blog is updated
- `blog:deleted` - Emitted when a blog is deleted
- `blog:comment:added` - Emitted when a comment is added to a blog

### User Profile
- `profile:updated` - Emitted when a profile is updated
- `profile:address:added` - Emitted when an address is added to a profile
- `profile:cart:updated` - Emitted when a cart is updated
- `profile:wishlist:updated` - Emitted when a wishlist is updated

### Contact
- `contact:submitted` - Emitted when a contact form is submitted
- `contact:read` - Emitted when a contact is read
- `contact:updated` - Emitted when a contact is updated 