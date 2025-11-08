# Finara Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Ethereum Sepolia Testnet
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_deployer_private_key_here
FACTORY_ADDRESS=will_be_set_after_deployment

# Relayer (for backend transactions)
RELAYER_PRIVATE_KEY=your_relayer_private_key_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server
PORT=3000
```

### 3. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create all tables

### 4. Deploy Smart Contracts

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia (make sure you have Sepolia ETH in your deployer wallet)
npm run deploy
```

After deployment, copy the Factory address from the output and update `FACTORY_ADDRESS` in your `.env` file.

### 5. Fund Relayer Wallet

Make sure your relayer wallet (the one corresponding to `RELAYER_PRIVATE_KEY`) has Sepolia ETH for gas fees.

### 6. Start the Backend Server

```bash
npm start
```

The server will be available at `http://localhost:3000`

## Testing the API

### 1. Deploy a Bank

```bash
curl -X POST http://localhost:3000/api/deployBank \
  -H "Content-Type: application/json" \
  -d '{
    "bankAddress": "0xYourBankAddress",
    "bankName": "Test Bank",
    "tokenName": "Test Bank Token",
    "tokenSymbol": "TBT",
    "maxSupply": 1000000,
    "collateralizationRatio": 15000
  }'
```

### 2. Upload Customers

```bash
curl -X POST http://localhost:3000/api/uploadCustomers \
  -H "Content-Type: application/json" \
  -d '{
    "bankAddress": "0xYourBankAddress",
    "customers": [
      {
        "name": "John Doe",
        "accountId": "ACC001",
        "walletAddress": "0xCustomerWalletAddress"
      }
    ]
  }'
```

### 3. Mint Tokens

```bash
curl -X POST http://localhost:3000/api/mintToken \
  -H "Content-Type: application/json" \
  -d '{
    "bankAddress": "0xYourBankAddress",
    "walletAddress": "0xCustomerWalletAddress",
    "amount": 1000
  }'
```

### 4. Create a Loan

```bash
curl -X POST http://localhost:3000/api/lend \
  -H "Content-Type: application/json" \
  -d '{
    "bankAddress": "0xYourBankAddress",
    "borrowerAddress": "0xCustomerWalletAddress",
    "collateralAmount": 1500,
    "loanAmount": 1000,
    "interestRate": 500,
    "duration": 2592000
  }'
```

## Important Notes

1. **Private Keys**: Never commit your `.env` file or share private keys
2. **Gas Fees**: Ensure both deployer and relayer wallets have sufficient Sepolia ETH
3. **RLS Policies**: Configure Supabase Row Level Security policies based on your needs
4. **Network**: All contracts are configured for Sepolia testnet
5. **Compilation**: Contracts must be compiled before the backend can load ABIs

## Troubleshooting

### "Contract artifacts not found"
- Run `npm run compile` to generate contract artifacts

### "Insufficient funds"
- Check that your relayer wallet has Sepolia ETH

### "Factory address not set"
- Deploy contracts first and update `FACTORY_ADDRESS` in `.env`

### "Supabase connection error"
- Verify your Supabase URL and API key are correct
- Ensure tables are created using the schema.sql file

