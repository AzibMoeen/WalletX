# WalletX

WalletX is a web-based platform designed to provide users with secure digital wallets that support three main currencies: USD, EUR, and PKR. The platform allows users to manage their funds, exchange currencies, send and receive money, and verify their accounts through a secure verification process.

## Core Functionality

### 1. **Role-Based Authentication (Admin-Based)**

- Users must register an account and log in with role-based authentication.
- Admin has the ability to approve or reject verification requests from users.

### 2. **Create Wallets**

- Users can create wallets in the following currencies:
  - **USD (United States Dollar)**
  - **EUR (Euro)**
  - **PKR (Pakistani Rupee)**

### 3. **Add Money to Wallet**

- Users can add funds to their wallets by linking their **bank account**.

### 4. **Currency Exchange**

- Users can exchange between the three available currencies (USD, EUR, PKR).
- Admin manages the exchange rates to ensure accurate and fair transactions.

### 5. **Send Money**

- Users can send money to other WalletX users directly.
- Money can be sent from one wallet to another with the option to select the currency.

### 6. **Request Money**

- Users can request money from others, allowing for peer-to-peer transactions.

### 7. **Withdraw and Deposit**

- Users can withdraw funds to their linked **bank accounts** or deposit money into their WalletX wallet from their bank account.

### 8. **Account Verification**

- Upon account creation, users must verify their identity before accessing full functionality.
  - **Two-step Verification Process:**
    - **Passport** verification.
    - **Gun** verification for added security.

- Admin approves both verification requests before users can access the features of WalletX.

### 9. **Admin Role**

- The **admin** role is responsible for:
  - Reviewing and approving user account verifications.
  - Managing user accounts and overseeing transactions.

## Setup and Installation

### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/walletx.git
cd walletx
