## Expense Tracker App with Analytics
#### **1. Core Features**
1. **Home Screen**:
   - A list of all expenses, sorted by date (newest first).
   - Each expense should display:
     - Expense name.
     - Amount.
     - Date.
     - Category (e.g., Food, Travel, Entertainment).
   - Add a **delete** button to remove an expense.

2. **Add/Edit Expense Screen**:
   - A form to add or edit an expense:
     - Fields: Name, Amount, Date, Category (dropdown).
     - Input validation (e.g., amount must be numeric, name must not be empty).
   - Categories can be hardcoded (e.g., Food, Travel, Entertainment, Bills, Miscellaneous).

3. **Dashboard Screen**:
   - Show analytics:
     - Total expenses for the current month.
     - A breakdown of expenses by category (e.g., Pie Chart or Bar Chart).
   - A filter option to view analytics for a specific date range.

4. **Offline Support**:
   - Store expenses locally using **AsyncStorage** or **SQLite**.
   - Sync with a mock backend when the app reconnects to the internet.

1. **State Management**:
   - Used **Redux**.
2. **Local Storage**:
   - Used **AsyncStorage**  to store expenses offline.
3. **Mock API Integration**:
   - Fetch initial data from a mock backend and sync offline data to the server.
     - `GET /expenses`: Fetch all expenses.
     - `POST /expenses`: Add a new expense.
     - `PUT /expenses/:id`: Update an existing expense.
     - `DELETE /expenses/:id`: Delete an expense.
       
  
1. **Search and Filter**:
   - Add a search bar to filter expenses by name or category.
