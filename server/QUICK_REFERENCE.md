# Quick Reference - Cart & Payment API

## 🚀 Quick Start

### Get JWT Token
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'
```

### Use JWT in All Protected Requests
```bash
curl -X GET http://localhost:8000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 All Cart & Payment Endpoints

### Cart Management (Requires Auth)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/cart` | View current cart |
| POST | `/api/cart/items` | Add item to cart |
| PATCH | `/api/cart/items/{itemId}` | Update quantity |
| DELETE | `/api/cart/items/{itemId}` | Remove item |
| DELETE | `/api/cart` | Clear entire cart |

### Checkout & Payment (Requires Auth)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/checkout` | Convert cart to order |
| GET | `/api/payments/{paymentId}` | View payment status |
| POST | `/api/payments/{paymentId}/confirm` | Confirm/update payment |

### Authentication (Public/Mixed)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/signup` | Create account | No |
| POST | `/api/login` | Get JWT token | No |
| POST | `/api/logout` | Invalidate token | Yes |
| POST | `/api/refresh` | Get new token | Yes |
| POST | `/api/me` | Get current user | Yes |

---

## 💡 Common API Calls

### Add Item to Cart
```json
POST /api/cart/items
Authorization: Bearer {token}

{
  "item_id": 5,
  "quantity": 2
}
```

### View Cart
```bash
GET /api/cart
Authorization: Bearer {token}
```

### Checkout
```json
POST /api/checkout
Authorization: Bearer {token}

{
  "payment_method": "card",
  "billing_name": "John Doe",
  "billing_email": "john@example.com",
  "notes": "Express delivery",
  "currency": "USD"
}
```

### Confirm Payment (After Gateway Processing)
```json
POST /api/payments/{paymentId}/confirm
Authorization: Bearer {token}

{
  "status": "paid",
  "reference": "STRIPE-CH_1234567890"
}
```

---

## 🗂️ Database Tables

| Table | Purpose |
|-------|---------|
| `carts` | User shopping carts |
| `cart_items` | Items in cart (links to items via item_id) |
| `orders` | Completed/pending purchases |
| `order_items` | Items purchased (snapshots at order time) |
| `payments` | Payment transactions |

---

## 📊 Data Flow

```
1. User adds items
   └─ POST /api/cart/items
      └─ Creates/updates CartItem
      └─ Updates Cart totals

2. User initiates checkout
   └─ POST /api/checkout
      └─ Creates Order from Cart
      └─ Creates OrderItems (snapshots)
      └─ Creates Payment record
      └─ Clears Cart

3. Payment processed (external gateway)
   └─ Frontend calls:
   └─ POST /api/payments/{id}/confirm
      └─ Updates Payment status
      └─ Updates Order status
```

---

## 🔐 Authentication

**JWT Token:**
- Returned from login/signup endpoints
- Valid for 1 hour (3600 seconds)
- Include in `Authorization: Bearer {token}` header
- Use POST /api/refresh to get new token before expiry

**Protected Routes:**
- All cart endpoints
- All payment endpoints
- /api/me, /api/logout, /api/refresh

**Public Routes:**
- /api/login
- /api/signup
- /api/items (browse catalog)
- /api/item (get item details)

---

## ✅ Status Values

### Payment Status
- `pending` - Awaiting payment
- `paid` - Successfully paid
- `failed` - Payment failed
- `cancelled` - User cancelled
- `refunded` - Money returned

### Order Status
- `pending` - Order created, awaiting payment
- `paid` - Payment received
- `failed` - Payment failed
- `cancelled` - Order cancelled
- `refunded` - Order refunded

---

## 🛠️ Testing

Run tests to verify everything works:
```bash
php artisan test tests/Feature/CartAndPaymentTest.php

# All 11 cart/payment tests should pass
```

Run all tests:
```bash
php artisan test
```

---

## 💾 Database

Current migrations run successfully:
```bash
✓ create_users_table
✓ create_carts_table
✓ create_cart_items_table
✓ create_orders_table
✓ create_order_items_table
✓ create_payments_table
```

Fresh database:
```bash
php artisan migrate:fresh
```

---

## 🚨 Error Handling

| Code | Meaning | Example |
|------|---------|---------|
| 401 | Unauthorized | Missing JWT token |
| 404 | Not found | Cart item doesn't exist |
| 422 | Validation error | Empty cart at checkout |
| 500 | Server error | Database issue |

---

## 📱 Example Frontend Integration

```javascript
// 1. Login
const response = await fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});
const { access_token } = await response.json();

// 2. Add to cart
await fetch('/api/cart/items', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    item_id: 5,
    quantity: 2
  })
});

// 3. Checkout
const checkout = await fetch('/api/checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    payment_method: 'card',
    billing_name: 'John Doe',
    billing_email: 'john@example.com'
  })
});

// 4. Process payment with Stripe/PayPal/etc
// 5. Confirm payment
await fetch(`/api/payments/${paymentId}/confirm`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'paid',
    reference: 'STRIPE_CHARGE_ID'
  })
});
```

---

## 📞 Need Help?

- Full API docs: `CART_PAYMENT_API.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Tests: `tests/Feature/CartAndPaymentTest.php`

