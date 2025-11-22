// Test script to verify expense creation flow
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_USER_ID = 'test-user-123';

async function test_expense_flow() {
  console.log('🧪 Testing Expense Creation Flow\n');

  try {
    // Step 1: Get categories
    console.log('1️⃣ Fetching categories...');
    const categories_response = await axios.get(`${BASE_URL}/categories/${TEST_USER_ID}`);
    const categories = categories_response.data.data;
    console.log(`✅ Found ${categories.length} categories`);

    if (categories.length === 0) {
      console.error('❌ No categories found. Run: npm run seed');
      return;
    }

    const first_category = categories[0];
    console.log(`   Using category: ${first_category.category_name} (${first_category.category_id})\n`);

    // Step 2: Create an expense
    console.log('2️⃣ Creating test expense...');
    const expense_data = {
      user_id: TEST_USER_ID,
      category_id: first_category.category_id,
      expense_amount: 250.50,
      expense_description: 'Test expense from script',
      expense_date: new Date().toISOString(),
      payment_method: 'upi'
    };

    const create_response = await axios.post(`${BASE_URL}/expenses`, expense_data);
    const created_expense = create_response.data.data;
    console.log(`✅ Expense created: ${created_expense.expense_id}`);
    console.log(`   Amount: ₹${created_expense.expense_amount}`);
    console.log(`   Description: ${created_expense.expense_description}\n`);

    // Step 3: Get all expenses
    console.log('3️⃣ Fetching all expenses...');
    const expenses_response = await axios.get(`${BASE_URL}/expenses/${TEST_USER_ID}?page=1&limit=10`);
    const expenses = expenses_response.data.data.expenses;
    console.log(`✅ Found ${expenses.length} expenses`);
    expenses.forEach((exp, i) => {
      console.log(`   ${i + 1}. ₹${exp.expense_amount} - ${exp.expense_description || 'No description'}`);
    });

    console.log('\n🎉 All tests passed! The expense creation flow works correctly.\n');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('   Network error - Cannot reach backend');
      console.error('   Make sure backend is running: npm run dev');
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

test_expense_flow();
