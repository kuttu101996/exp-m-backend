# Expense Manager Backend

Complete REST API for Expense Tracker application built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- ✅ **TypeScript** - Full type safety
- ✅ **MongoDB + Mongoose** - Scalable database with indexes
- ✅ **Fuzzy Matching** - Smart category duplicate detection (70% similarity threshold)
- ✅ **Advanced Analytics** - Daily/Weekly/Monthly breakdowns
- ✅ **Date Filtering** - Flexible expense queries
- ✅ **Pagination** - Efficient data loading
- ✅ **snake_case** - Consistent naming convention throughout

## 📦 Tech Stack

- **Runtime**: Node.js v20.x (LTS)
- **Framework**: Express v4.19
- **Language**: TypeScript v5.6
- **Database**: MongoDB v8.7 (Mongoose)
- **Validation**: express-validator
- **ID Generation**: UUID v10

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/         # Database & environment config
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── middlewares/    # Error handlers
│   ├── types/          # TypeScript interfaces (shared with frontend)
│   ├── utils/          # Helper functions (fuzzy match, responses)
│   └── index.ts        # Express server entry point
├── .env.example        # Environment variables template
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## ⚙️ Installation

### Prerequisites
- Node.js v20.x or higher
- MongoDB installed locally or MongoDB Atlas account

### Steps

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense_manager
API_PREFIX=/api/v1
```

3. **Start MongoDB** (if running locally)
```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

4. **Run development server**
```bash
npm run dev
```

Server will start at: `http://localhost:5000`

## 🎯 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production server
npm run lint     # Run ESLint
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint reference.

### Quick Examples

**Health Check**
```bash
curl http://localhost:5000/health
```

**Create Category**
```bash
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user-123","category_name":"Food","category_icon":"🍔"}'
```

**Get Analytics**
```bash
curl "http://localhost:5000/api/v1/analytics/user-123?start_date=2024-01-01&end_date=2024-01-31"
```

## 🗄️ Database Schema

### Collections

1. **user_profiles** - User information
2. **expense_categories** - Main expense categories
3. **expense_sub_categories** - Sub-categories under main categories
4. **user_expenses** - Individual expense records

All fields use `snake_case` naming.

### Indexes

Optimized indexes for:
- User-specific queries
- Date range filtering
- Category lookups
- Analytics aggregation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/expense_manager |
| `API_PREFIX` | API route prefix | /api/v1 |

## 🚢 Production Deployment

### Build

```bash
npm run build
```

This creates a `dist/` folder with compiled JavaScript.

### Start Production Server

```bash
NODE_ENV=production npm start
```

### Recommended Hosting

- **Backend**: Railway, Render, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas (free tier available)

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in production environment

Example:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_manager
```

## 🔐 Security Notes

- CORS enabled for frontend integration
- Input validation on all endpoints
- Error messages sanitized
- No sensitive data in responses

## 🧪 Testing

Use Postman, Insomnia, or cURL to test endpoints.

Import the API documentation into Postman for easy testing.

## 📝 TypeScript Types

All types are in `src/types/index.ts` and can be shared with the frontend:

```typescript
import { user_expense, expense_category } from './types';
```

## 🤝 Integration with Frontend

Share the following with the frontend team:

1. `src/types/index.ts` - TypeScript interfaces
2. `API_DOCUMENTATION.md` - Complete API reference
3. Base URL and API prefix

## 📊 Features Breakdown

### ✅ Categories
- CRUD operations
- Duplicate detection (fuzzy matching)
- Default categories (non-deletable)
- Icon and color support

### ✅ Sub-Categories
- Linked to parent categories
- CRUD operations

### ✅ Expenses
- Full CRUD operations
- Date range filtering
- Category filtering
- Pagination support
- Payment method tracking

### ✅ Analytics
- Overall summary
- Category-wise breakdown with percentages
- Daily/Weekly/Monthly aggregations
- Custom date ranges

## 🎨 Naming Convention

**Enforced throughout the application:**

- Collections: `expense_categories`, `user_expenses`
- Fields: `category_name`, `expense_amount`, `created_at`
- Variables: `user_id`, `total_amount`
- Functions: `get_categories`, `create_expense`

**NO camelCase** - Everything is snake_case!

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Or check MongoDB service status
sudo systemctl status mongod
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### TypeScript Errors
```bash
# Clean build
rm -rf dist/
npm run build
```

## 📞 Support

For issues or questions:
1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review error messages in console
3. Verify MongoDB connection
4. Check environment variables

## 🎯 Next Steps

1. ✅ Backend is complete and ready
2. Frontend team can start integration
3. Use TypeScript types from `src/types/index.ts`
4. Follow API documentation for endpoints
5. Test with sample data

---

**Built with ❤️ using TypeScript, Express, and MongoDB**
