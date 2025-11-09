# Finara API - Postman Collection

## 📋 Setup

1. **Base URL**: `http://localhost:3000`
2. **Make sure backend is running**: `npm start`
3. **No authentication required** for testing

---

## 🔍 Test Endpoints

### 1️⃣ Health Check
**Test if server is running**

```
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Finara API is running",
  "timestamp": "2025-11-08T...",
  "environment": "development"
}
```

---

### 2️⃣ Root Endpoint
**View all available endpoints**

```
GET http://localhost:3000/
```

**Expected Response:**
```json
{
  "success": true,
  "name": "Finara API",
  "version": "1.0.0",
  "endpoints": {
    "bank": { ... },
    "customers": { ... },
    "tokens": { ... },
    "lending": { ... }
  }
}
```

---

### 3️⃣ Deploy Bank
**Deploy smart contracts for a new bank**

```
POST http://localhost:3000/api/deployBank
Content-Type: application/json

{
  "bankAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "bankName": "Test Bank",
  "tokenName": "Test Token",
  "tokenSymbol": "TEST",
  "maxSupply": "1000000",
  "collateralizationRatio": 15000
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "tokenAddress": "0x...",
    "lendingAddress": "0x...",
    "bankAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "txHash": "0x..."
  }
}
```

---

### 4️⃣ Get Bank Details
**Retrieve bank information**

```
GET http://localhost:3000/api/bank/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "bank_address": "0xf39...",
    "bank_name": "Test Bank",
    "token_address": "0x...",
    "lending_address": "0x...",
    "created_at": "..."
  }
}
```

---

### 5️⃣ Upload Customers
**Add KYC-verified customers**

```
POST http://localhost:3000/api/uploadCustomers
Content-Type: application/json

{
  "bankAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "customers": [
    {
      "name": "John Doe",
      "accountId": "ACC001",
      "walletAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    },
    {
      "name": "Jane Smith",
      "accountId": "ACC002",
      "walletAddress": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "John Doe",
      "account_id": "ACC001",
      "wallet_address": "0x70997...",
      "kyc_status": "verified"
    }
  ]
}
```

---

### 6️⃣ Get Customers by Bank
**List all customers for a bank**

```
GET http://localhost:3000/api/customers/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

### 7️⃣ Verify Customer
**Check if wallet is KYC verified**

```
GET http://localhost:3000/api/customer/0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

**Expected Response:**
```json
{
  "success": true,
  "verified": true,
  "data": {
    "name": "John Doe",
    "account_id": "ACC001",
    "kyc_status": "verified"
  }
}
```

---

### 8️⃣ Mint Tokens
**Tokenize an asset and mint tokens**

```
POST http://localhost:3000/api/mintToken
Content-Type: application/json

{
  "bankAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "recipientAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "amount": "100",
  "assetId": "GOLD001",
  "assetType": "gold"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "0x...",
    "amount": "100",
    "recipient": "0x70997..."
  }
}
```

---

### 9️⃣ Check Token Balance
**Get token balance for an address**

```
GET http://localhost:3000/api/balance/0x70997970C51812dc3A010C7d01b50e0d17dc79C8?bankAddress=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**Expected Response:**
```json
{
  "success": true,
  "balance": "100.0"
}
```

---

### 🔟 Create Loan
**Issue a collateralized loan**

```
POST http://localhost:3000/api/createLoan
Content-Type: application/json

{
  "bankAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "borrowerAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "collateralAmount": "50",
  "loanAmount": "30",
  "interestRate": 5,
  "durationDays": 30
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "loanId": "1",
    "txHash": "0x...",
    "borrower": "0x70997...",
    "collateralAmount": "50",
    "loanAmount": "30"
  }
}
```

---

### 1️⃣1️⃣ Get Loans by Bank
**List all loans for a bank**

```
GET http://localhost:3000/api/loans/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

### 1️⃣2️⃣ Get Loan Details
**Get specific loan information**

```
GET http://localhost:3000/api/loan/1?bankAddress=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

### 1️⃣3️⃣ Repay Loan
**Repay an active loan**

```
POST http://localhost:3000/api/repayLoan/1
Content-Type: application/json

{
  "bankAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "amount": "31.5"
}
```

---

## 🚀 Quick Test Flow

**Step-by-step testing:**

1. **Health Check** → Verify server is running
2. **Deploy Bank** → Create bank contracts
3. **Upload Customers** → Add KYC verified users
4. **Mint Tokens** → Tokenize assets
5. **Create Loan** → Issue collateralized loan
6. **Check Balance** → Verify token balances
7. **Repay Loan** → Complete loan cycle

---

## 🔧 Common Addresses (Hardhat Network)

```
Deployer/Bank: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Customer 1:    0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Customer 2:    0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Customer 3:    0x90F79bf6EB2c4f870365E785982E1f101E93b906
```

---

## ⚠️ Notes

- **Supabase Required**: Some endpoints need Supabase configured
- **Without Supabase**: You'll get database connection errors
- **Mock Mode**: You can test blockchain functions without DB
- **All transactions**: Use local Hardhat network (instant, free)

---

## 🐛 Troubleshooting

**"Cannot connect to database"**
→ Setup Supabase and update .env

**"Transaction failed"**
→ Make sure contracts are deployed

**"Address not verified"**
→ Upload customers first with uploadCustomers

**"Insufficient balance"**
→ Mint tokens before creating loans

---

## 📊 Import to Postman

1. Open Postman
2. Click "Import"
3. Copy-paste the requests above
4. Set Base URL as variable: `{{baseURL}} = http://localhost:3000`
5. Save as "Finara API Collection"
