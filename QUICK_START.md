# 🚀 Quick Start Guide

Get the Expense Manager backend running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages including Express, MongoDB, TypeScript, etc.

## Step 2: Setup Environment

Create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

The default `.env` settings work for local development:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense_manager
API_PREFIX=/api/v1
```

## Step 3: Start MongoDB

### Option A: Local MongoDB

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

### Option B: MongoDB Atlas (Cloud - Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_manager
```

## Step 4: Seed Database (Optional but Recommended)

This creates a test user and 13 default categories:

```bash
npm run seed
```

You'll see output like:
```
✅ Test user created: test-user-123
✅ Created 13 default categories
🎉 Database seeding completed successfully!
```

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Expense Manager API Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:5000
🔧 Environment: development
📋 API Base: /api/v1
💚 Health Check: http://localhost:5000/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 6: Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Expense Manager API is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Get Categories (if you ran seed)
```bash
curl http://localhost:5000/api/v1/categories/test-user-123
```

### Create Your First Expense
```bash
curl -X POST http://localhost:5000/api/v1/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-123",
    "category_id": "CATEGORY_ID_FROM_PREVIOUS_RESPONSE",
    "expense_amount": 500,
    "expense_description": "Coffee",
    "expense_date": "2024-01-20",
    "payment_method": "upi"
  }'
```

## 🎯 What's Next?

1. ✅ Backend is running!
2. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for all endpoints
3. Frontend team can start integrating
4. Use `test-user-123` for testing

## 🔧 Common Issues

### Issue: MongoDB connection error
**Solution:** Make sure MongoDB is running
```bash
# Check status
mongosh

# Or restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
net stop MongoDB && net start MongoDB    # Windows
```

### Issue: Port 5000 already in use
**Solution:** Change port in `.env` file
```env
PORT=3000
```

### Issue: npm install fails
**Solution:** Make sure you have Node.js v20+ installed
```bash
node --version  # Should be v20.x or higher
```

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run seed` | Seed database with test data |
| `npm run lint` | Run code linting |

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api/v1`

- `GET /categories/:user_id` - Get all categories
- `POST /categories` - Create category
- `POST /categories/check-similar` - Check duplicate categories
- `GET /expenses/:user_id` - Get expenses (with filters)
- `POST /expenses` - Create expense
- `GET /analytics/:user_id` - Get analytics & breakdown
- `GET /analytics/:user_id/daily` - Daily breakdown
- `GET /analytics/:user_id/weekly` - Weekly breakdown
- `GET /analytics/:user_id/monthly` - Monthly breakdown

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details!

## 🎨 Default Categories Created by Seed

When you run `npm run seed`, these categories are created:

1. 🍔 Food & Dining
2. 🚗 Transport
3. 🛍️ Shopping
4. 🎬 Entertainment
5. 💡 Bills & Utilities
6. 🏥 Healthcare
7. 📚 Education
8. ✈️ Travel
9. 🛒 Groceries
10. 💆 Personal Care
11. 🏠 Rent
12. 💰 Savings
13. 📁 Other

## 💡 Pro Tips

1. **Use the test user** (`test-user-123`) for initial testing
2. **Run seed script** to get pre-populated categories
3. **Check console logs** - they show useful debugging info
4. **Use Postman/Insomnia** for easier API testing
5. **Read API_DOCUMENTATION.md** for detailed examples

## 🐛 Debugging

Enable detailed MongoDB logs by adding to `.env`:
```env
DEBUG=*
```

Check server logs in the terminal where `npm run dev` is running.

---

**🎉 You're all set! The backend is ready for frontend integration.**

For questions, check:
- [README.md](./README.md) - Complete documentation
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
