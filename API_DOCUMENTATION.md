# Expense Manager API Documentation

Base URL: `http://localhost:5000/api/v1`

All fields use **snake_case** naming convention.

---

## 📋 Table of Contents

1. [Categories API](#categories-api)
2. [Sub-Categories API](#sub-categories-api)
3. [Expenses API](#expenses-api)
4. [Analytics API](#analytics-api)

---

## Categories API

### 1. Get All Categories for User
```http
GET /api/v1/categories/:user_id
```

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "category_id": "uuid-here",
      "user_id": "user-uuid",
      "category_name": "Food",
      "category_icon": "🍔",
      "category_color": "#ff6b6b",
      "is_default": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Category
```http
GET /api/v1/categories/detail/:category_id
```

---

### 3. Check Similar Categories
```http
POST /api/v1/categories/check-similar
```

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "category_name": "Foood"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Similar categories checked",
  "data": {
    "has_similar": true,
    "suggestions": [
      {
        "text": "Food",
        "similarity": 80
      }
    ]
  }
}
```

---

### 4. Create Category
```http
POST /api/v1/categories
```

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "category_name": "Transport",
  "category_icon": "🚗",
  "category_color": "#4ecdc4"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category_id": "generated-uuid",
    "user_id": "user-uuid",
    "category_name": "Transport",
    "category_icon": "🚗",
    "category_color": "#4ecdc4",
    "is_default": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Update Category
```http
PUT /api/v1/categories/:category_id
```

**Request Body:**
```json
{
  "category_name": "Updated Name",
  "category_icon": "🎯",
  "category_color": "#95e1d3"
}
```

---

### 6. Delete Category
```http
DELETE /api/v1/categories/:category_id
```

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "category_id": "deleted-uuid"
  }
}
```

---

## Sub-Categories API

### 1. Get All Sub-Categories for Category
```http
GET /api/v1/sub-categories/:category_id
```

---

### 2. Create Sub-Category
```http
POST /api/v1/sub-categories
```

**Request Body:**
```json
{
  "category_id": "parent-category-uuid",
  "sub_category_name": "Groceries"
}
```

---

### 3. Update Sub-Category
```http
PUT /api/v1/sub-categories/:sub_category_id
```

**Request Body:**
```json
{
  "sub_category_name": "Updated Sub-Category"
}
```

---

### 4. Delete Sub-Category
```http
DELETE /api/v1/sub-categories/:sub_category_id
```

---

## Expenses API

### 1. Get All Expenses (with filters)
```http
GET /api/v1/expenses/:user_id?start_date=2024-01-01&end_date=2024-12-31&category_id=uuid&page=1&page_size=50
```

**Query Parameters:**
- `start_date` (optional): Filter by start date (YYYY-MM-DD)
- `end_date` (optional): Filter by end date (YYYY-MM-DD)
- `category_id` (optional): Filter by category
- `sub_category_id` (optional): Filter by sub-category
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "data": {
    "expenses": [
      {
        "expense_id": "uuid",
        "user_id": "user-uuid",
        "category_id": "category-uuid",
        "sub_category_id": "sub-category-uuid",
        "expense_amount": 500,
        "expense_description": "Grocery shopping",
        "expense_date": "2024-01-15T00:00:00.000Z",
        "payment_method": "upi",
        "created_at": "2024-01-15T00:00:00.000Z",
        "updated_at": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total_count": 100,
      "page": 1,
      "page_size": 50,
      "total_pages": 2
    }
  }
}
```

---

### 2. Get Single Expense
```http
GET /api/v1/expenses/detail/:expense_id
```

---

### 3. Create Expense
```http
POST /api/v1/expenses
```

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "category_id": "category-uuid",
  "sub_category_id": "sub-category-uuid",
  "expense_amount": 1500,
  "expense_description": "Monthly grocery",
  "expense_date": "2024-01-20",
  "payment_method": "upi"
}
```

**Payment Methods:** `cash`, `card`, `upi`, `net_banking`, `other`

---

### 4. Update Expense
```http
PUT /api/v1/expenses/:expense_id
```

**Request Body:**
```json
{
  "expense_amount": 1600,
  "expense_description": "Updated description",
  "payment_method": "card"
}
```

---

### 5. Delete Expense
```http
DELETE /api/v1/expenses/:expense_id
```

---

## Analytics API

### 1. Get Analytics (Category Breakdown)
```http
GET /api/v1/analytics/:user_id?start_date=2024-01-01&end_date=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "summary": {
      "total_amount": 25000,
      "expense_count": 45,
      "period_start": "2024-01-01T00:00:00.000Z",
      "period_end": "2024-01-31T23:59:59.999Z"
    },
    "category_breakdown": [
      {
        "category_id": "uuid",
        "category_name": "Food",
        "category_icon": "🍔",
        "category_color": "#ff6b6b",
        "total_amount": 8000,
        "expense_count": 20,
        "percentage": 32
      },
      {
        "category_id": "uuid",
        "category_name": "Transport",
        "category_icon": "🚗",
        "category_color": "#4ecdc4",
        "total_amount": 5000,
        "expense_count": 15,
        "percentage": 20
      }
    ]
  }
}
```

---

### 2. Daily Breakdown
```http
GET /api/v1/analytics/:user_id/daily?start_date=2024-01-01&end_date=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "message": "Daily breakdown retrieved successfully",
  "data": [
    {
      "date": "2024-01-01",
      "total_amount": 500,
      "expense_count": 3
    },
    {
      "date": "2024-01-02",
      "total_amount": 800,
      "expense_count": 5
    }
  ]
}
```

---

### 3. Weekly Breakdown
```http
GET /api/v1/analytics/:user_id/weekly?start_date=2024-01-01&end_date=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "message": "Weekly breakdown retrieved successfully",
  "data": [
    {
      "year": 2024,
      "week": 1,
      "total_amount": 3500,
      "expense_count": 15
    },
    {
      "year": 2024,
      "week": 2,
      "total_amount": 4200,
      "expense_count": 18
    }
  ]
}
```

---

### 4. Monthly Breakdown
```http
GET /api/v1/analytics/:user_id/monthly?start_date=2024-01-01&end_date=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "message": "Monthly breakdown retrieved successfully",
  "data": [
    {
      "year": 2024,
      "month": 1,
      "total_amount": 15000,
      "expense_count": 50
    },
    {
      "year": 2024,
      "month": 2,
      "total_amount": 18000,
      "expense_count": 60
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense_manager
API_PREFIX=/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Testing with cURL

### Create a Category
```bash
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-123",
    "category_name": "Food",
    "category_icon": "🍔",
    "category_color": "#ff6b6b"
  }'
```

### Create an Expense
```bash
curl -X POST http://localhost:5000/api/v1/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-123",
    "category_id": "category-uuid-here",
    "expense_amount": 500,
    "expense_description": "Lunch",
    "expense_date": "2024-01-20",
    "payment_method": "upi"
  }'
```

### Get Analytics
```bash
curl "http://localhost:5000/api/v1/analytics/test-user-123?start_date=2024-01-01&end_date=2024-01-31"
```

---

## Frontend Integration Notes

All TypeScript types are available in `src/types/index.ts` and can be shared with the frontend team.

**Key Features for Frontend:**
1. ✅ Fuzzy category name matching with 70% threshold
2. ✅ Pagination support for expense lists
3. ✅ Flexible date filtering
4. ✅ Category-wise expense breakdown
5. ✅ Daily/Weekly/Monthly analytics
6. ✅ Consistent snake_case naming

**Share this with ChatGPT/Frontend Team! 🚀**
