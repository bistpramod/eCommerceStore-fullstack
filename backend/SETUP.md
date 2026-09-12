# Backend setup after middleware + Cloudinary changes

## 1. Install packages

```bash
npm install
```

This installs the new `cloudinary` and `multer` packages.

## 2. Create `.env`

Copy `.env_sample` to `.env` and fill in your own values:

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_EMAIL=your_admin_email@example.com
```

The `ADMIN_EMAIL` account is treated as the admin account.

## 3. Product images

The admin Add/Edit Product page now sends the selected image as a file.

Backend flow:

Frontend -> multer -> Cloudinary -> secure image URL -> MongoDB

You do not need to save the image file on your server.

## 4. Middleware

The project now has:

- `protect` - checks the JWT token
- `sameUser` - stops users from accessing another user's cart/address/order
- `adminOnly` - protects admin product actions
- `notFound` - catches unknown API routes
- `errorHandler` - handles server errors

The existing project structure is kept simple.
