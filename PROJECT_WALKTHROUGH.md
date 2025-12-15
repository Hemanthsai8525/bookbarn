# Vendor Management System Walkthrough

## 1. Vendor Self-Registration
1.  Navigate to `/vendors/register`.
2.  Fill in the details (Name, Email, Password, Phone, Address).
3.  Submit the form.
4.  **Expectation**: You should be redirected to `/vendors/login` with a success message. Your account status is now **PENDING**.

## 2. Admin Approval Process
1.  Log in as an **Admin** (e.g., `admin` / `password`).
2.  Navigate to **Admin Dashboard**.
3.  Click on **"Manage Vendors"** or go to `/admin/vendors`.
4.  You should see the newly registered vendor with status **PENDING**.
5.  Click the **Approve** (Checkmark) button.
6.  **Expectation**: The vendor status updates to **APPROVED**.

## 3. Vendor Dashboard & Book Management
1.  Log in as the **Vendor** you just approved at `/vendors/login`.
2.  You should land on the **Vendor Dashboard**.
3.  **Add a Book**:
    *   Click "Add New Book".
    *   Fill in Title, Author, Price, Stock, Category, etc.
    *   Submit.
    *   **Expectation**: Book appears in your dashboard list.
4.  **Edit a Book**:
    *   Hover over a book card and click the **Edit** (Pencil) icon.
    *   Change the Price or Stock.
    *   Update.
    *   **Expectation**: The book details update immediately.
5.  **Delete a Book**:
    *   Hover over a book card and click the **Delete** (Trash) icon.
    *   Confirm deletion.
    *   **Expectation**: The book is removed from your list.

## 4. Admin Verification
1.  Log in as **Admin** again.
2.  Go to **Manage Books** (`/admin/books`).
3.  Search for the book added by the vendor.
4.  **Expectation**: The book appears in the list, and you can filter it by the vendor's name.

## 5. User Purchase Flow (Optional Verification)
1.  Log in as a normal **User**.
2.  Browse/Search for the vendor's book.
3.  Add to Cart and Checkout.
4.  **Expectation**: Order is placed successfully.
5.  Go to **Order Details** (`/orders/{id}`).
6.  **Expectation**: The item line shows "Sold by [Vendor Name]".

## Troubleshooting
*   **Login Fails**: Ensure the vendor is **APPROVED** by an Admin. Pending/Rejected vendors cannot login.
*   **Images**: If images don't load, ensure the URL is valid or use a placeholder.
*   **Casing Issues**: If you see errors about `payment.jsx`, ensure you are using the latest `App.jsx` where the import was corrected to `Payment.jsx`.
