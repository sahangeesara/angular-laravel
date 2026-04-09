# Cart & Payment API Documentation

## Overview
This document describes the cart and payment endpoints added to the Laravel API. All cart and payment endpoints require JWT authentication via the `auth:api` middleware.

---

## Authentication

### Login
**POST** `/api/login`
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
**Response (200)**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": "John Doe"
}
```

### Sign Up
**POST** `/api/signup`
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

### Logout
**POST** `/api/logout`
- Requires: `Authorization: Bearer {token}`

### Refresh Token
**POST** `/api/refresh`
- Requires: `Authorization: Bearer {token}`

### Get Current User
**POST** `/api/me`
- Requires: `Authorization: Bearer {token}`

---

## Cart Endpoints

### View Cart
**GET** `/api/cart`
- Requires: `Authorization: Bearer {token}`
- Returns the current user's cart with all items

**Response (200)**
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active",
  "currency": "USD",
  "item_count": 3,
  "total_amount": "299.97",
  "items": [
    {
      "id": 1,
      "item_id": 5,
      "quantity": 2,
      "unit_price": "49.99",
      "line_total": "99.98",
      "item": {
        "id": 5,
        "itemname": "Product Name",
        "itemprice": "49.99",
        "itemcode": "PROD001",
        "image": "...",
        "image_url": "http://..."
      }
    }
  ]
}
```

### Add Item to Cart
**POST** `/api/cart/items`
- Requires: `Authorization: Bearer {token}`

**Request**
```json
{
  "item_id": 5,
  "quantity": 2
}
```

**Response (201)**
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active",
  "currency": "USD",
  "item_count": 2,
  "total_amount": "99.98",
  "items": [...]
}
```

**Errors**
- `404`: Item not found
- `422`: Validation error

### Update Cart Item Quantity
**PATCH** `/api/cart/items/{itemId}`
- Requires: `Authorization: Bearer {token}`

**Request**
```json
{
  "quantity": 5
}
```

**Response (200)**
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active",
  "currency": "USD",
  "item_count": 5,
  "total_amount": "249.95",
  "items": [...]
}
```

**Errors**
- `404`: Cart item not found

### Remove Item from Cart
**DELETE** `/api/cart/items/{itemId}`
- Requires: `Authorization: Bearer {token}`

**Response (200)**
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active",
  "currency": "USD",
  "item_count": 0,
  "total_amount": "0.00",
  "items": []
}
```

**Errors**
- `404`: Cart item not found

### Clear Cart
**DELETE** `/api/cart`
- Requires: `Authorization: Bearer {token}`
- Removes all items from the cart

**Response (200)**
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active",
  "currency": "USD",
  "item_count": 0,
  "total_amount": "0.00",
  "items": []
}
```

---

## Checkout Endpoint

### Create Checkout / Order
**POST** `/api/checkout`
- Requires: `Authorization: Bearer {token}`
- Converts cart to order and initiates payment

**Request**
```json
{
  "payment_method": "card",
  "billing_name": "John Doe",
  "billing_email": "john@example.com",
  "notes": "Please deliver after 6 PM",
  "currency": "USD"
}
```

**Response (201)**
```json
{
  "message": "Checkout created successfully.",
  "order": {
    "id": 1,
    "order_number": "ORD-ABC1234DEFG",
    "user_id": 1,
    "cart_id": 1,
    "status": "pending",
    "payment_status": "pending",
    "payment_method": "card",
    "currency": "USD",
    "subtotal": "99.98",
    "shipping_amount": "0.00",
    "tax_amount": "0.00",
    "total_amount": "99.98",
    "billing_name": "John Doe",
    "billing_email": "john@example.com",
    "notes": "Please deliver after 6 PM",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "item_id": 5,
        "item_name": "Product Name",
        "item_code": "PROD001",
        "quantity": 2,
        "unit_price": "49.99",
        "line_total": "99.98"
      }
    ]
  },
  "payment": {
    "id": 1,
    "order_id": 1,
    "user_id": 1,
    "provider": "card",
    "reference": "PAY-ABC123XYZ789",
    "amount": "99.98",
    "currency": "USD",
    "status": "pending",
    "payload": {...},
    "paid_at": null
  }
}
```

**Errors**
- `422`: Cart is empty

---

## Payment Endpoints

### Get Payment Status
**GET** `/api/payments/{paymentId}`
- Requires: `Authorization: Bearer {token}`
- Only users who own the payment can access it

**Response (200)**
```json
{
  "id": 1,
  "order_id": 1,
  "user_id": 1,
  "provider": "card",
  "reference": "PAY-ABC123XYZ789",
  "amount": "99.98",
  "currency": "USD",
  "status": "pending",
  "payload": {...},
  "paid_at": null,
  "order": {
    "id": 1,
    "order_number": "ORD-ABC1234DEFG",
    ...
  }
}
```

**Errors**
- `404`: Payment not found

### Confirm/Update Payment
**POST** `/api/payments/{paymentId}/confirm`
- Requires: `Authorization: Bearer {token}`
- Updates the payment status and syncs with the order

**Request**
```json
{
  "status": "paid",
  "reference": "STRIPE-CHARGE-12345",
  "provider": "stripe"
}
```

**Response (200)**
```json
{
  "message": "Payment updated successfully.",
  "payment": {
    "id": 1,
    "order_id": 1,
    "user_id": 1,
    "provider": "stripe",
    "reference": "STRIPE-CHARGE-12345",
    "amount": "99.98",
    "currency": "USD",
    "status": "paid",
    "payload": {...},
    "paid_at": "2026-04-09T10:30:00Z",
    "order": {...}
  }
}
```

**Status Values**
- `pending` - Payment awaiting confirmation
- `paid` - Payment completed successfully
- `failed` - Payment failed
- `cancelled` - Payment was cancelled by user
- `refunded` - Payment was refunded

---

## Database Tables

### carts
- `id` (Primary Key)
- `user_id` (Foreign Key → users)
- `status` (varchar: active, etc.)
- `currency` (varchar: USD, EUR, etc.)
- `item_count` (unsigned integer)
- `total_amount` (decimal 12,2)
- `timestamps`

### cart_items
- `id` (Primary Key)
- `cart_id` (Foreign Key → carts)
- `item_id` (unsigned big integer)
- `quantity` (unsigned integer)
- `unit_price` (decimal 12,2)
- `line_total` (decimal 12,2)
- `timestamps`

### orders
- `id` (Primary Key)
- `order_number` (varchar, unique)
- `user_id` (Foreign Key → users)
- `cart_id` (Foreign Key → carts, nullable)
- `status` (varchar: pending, paid, failed, etc.)
- `payment_status` (varchar: pending, paid, failed, etc.)
- `payment_method` (varchar 50)
- `currency` (varchar 10)
- `subtotal` (decimal 12,2)
- `shipping_amount` (decimal 12,2)
- `tax_amount` (decimal 12,2)
- `total_amount` (decimal 12,2)
- `billing_name` (varchar)
- `billing_email` (varchar)
- `notes` (text, nullable)
- `timestamps`

### order_items
- `id` (Primary Key)
- `order_id` (Foreign Key → orders)
- `item_id` (unsigned big integer)
- `item_name` (varchar)
- `item_code` (varchar, nullable)
- `quantity` (unsigned integer)
- `unit_price` (decimal 12,2)
- `line_total` (decimal 12,2)
- `timestamps`

### payments
- `id` (Primary Key)
- `order_id` (Foreign Key → orders)
- `user_id` (Foreign Key → users)
- `provider` (varchar 100)
- `reference` (varchar, nullable, indexed)
- `amount` (decimal 12,2)
- `currency` (varchar 10)
- `status` (varchar: pending, paid, failed, etc.)
- `payload` (json, nullable)
- `paid_at` (timestamp, nullable)
- `timestamps`

---

## Example Flow

1. **User logs in** → Receives JWT token
2. **User adds items to cart** → POST `/api/cart/items` (multiple calls)
3. **User reviews cart** → GET `/api/cart`
4. **User initiates checkout** → POST `/api/checkout`
5. **System creates order and payment record**
6. **Frontend handles payment gateway** (e.g., Stripe)
7. **Frontend confirms payment** → POST `/api/payments/{paymentId}/confirm`
8. **Order status updates** to paid/failed based on payment status

---

## Error Codes

- `401` - Unauthorized (missing or invalid token)
- `404` - Resource not found
- `422` - Validation error (empty cart, invalid quantity, etc.)
- `500` - Server error

---

## Notes

- All prices are stored as `decimal(12, 2)` for precision
- Item snapshots are created in `order_items` so price changes don't affect historical orders
- Cart is user-specific and created automatically on first cart access
- Cart items include the full item details for frontend display
- Payments are provider-agnostic (can be card, PayPal, Stripe, etc.)


