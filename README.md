# Finara - Blockchain-Based Tokenization and Lending Platform

Finara is a comprehensive blockchain infrastructure that enables banks to tokenize verified real-world assets and issue on-chain loans to KYC-verified customers. Built on Ethereum Sepolia testnet with ERC-3643 compliant tokens, the platform combines blockchain automation with secure bank-verified data management.

## Features

- **Bank Deployment**: Factory contract deploys Token and Lending contracts for each bank
- **ERC-3643 Compliant Tokens**: Only verified KYC customers can hold or trade tokens
- **On-Chain Lending**: Issue loans against tokenized assets with automated collateral management
- **Relayer Service**: All blockchain transactions handled server-side (no MetaMask required, no user gas fees)
- **Secure Data Storage**: Supabase integration for bank data, customer KYC records, and asset information
- **RESTful API**: Complete backend API for all operations

## Architecture

### Smart Contracts

1. **BankFactory**: Deploys Token and Lending contracts for each bank
2. **CompliantToken**: ERC-3643 inspired token with KYC verification and compliance features
3. **LendingContract**: Manages loans against tokenized assets with collateralization

### Backend Services

- **Express.js API**: RESTful endpoints for all operations
- **Relayer Service**: Handles all blockchain transactions using Ethers.js
- **Supabase Integration**: Secure storage for banks, customers, assets, and transactions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project
- Ethereum Sepolia testnet account with ETH for gas
- Hardhat for contract deployment

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Finara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file:
   ```env
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   PRIVATE_KEY=your_deployer_private_key
   FACTORY_ADDRESS=your_factory_address_after_deployment
   RELAYER_PRIVATE_KEY=your_relayer_private_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in the Supabase SQL Editor
   - Configure Row Level Security policies as needed

5. **Deploy smart contracts**
   ```bash
   npm run compile
   npm run deploy
   ```
   
   After deployment, update `FACTORY_ADDRESS` in your `.env` file with the deployed factory address.

## Usage

### Start the Backend Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will start on `http://localhost:3000`

### API Endpoints

#### 1. Deploy Bank
```http
POST /api/deployBank
Content-Type: application/json

{
  "bankAddress": "0x...",
  "bankName": "Example Bank",
  "tokenName": "Bank Token",
  "tokenSymbol": "BANK",
  "maxSupply": 1000000,
  "collateralizationRatio": 15000
}
```

#### 2. Upload Customers
```http
POST /api/uploadCustomers
Content-Type: application/json

{
  "bankAddress": "0x...",
  "customers": [
    {
      "name": "John Doe",
      "accountId": "ACC001",
      "walletAddress": "0x..."
    }
  ]
}
```

#### 3. Mint Tokens
```http
POST /api/mintToken
Content-Type: application/json

{
  "bankAddress": "0x...",
  "walletAddress": "0x...",
  "amount": 1000
}
```

#### 4. Create Loan
```http
POST /api/lend
Content-Type: application/json

{
  "bankAddress": "0x...",
  "borrowerAddress": "0x...",
  "collateralAmount": 1500,
  "loanAmount": 1000,
  "interestRate": 500,
  "duration": 2592000
}
```

#### 5. Get Banks
```http
GET /api/banks
```

#### 6. Get Customers
```http
GET /api/customers/:bankAddress
```

#### 7. Get Loans
```http
GET /api/loans/:bankAddress
```

## Project Structure

```
Finara/
├── contracts/              # Smart contracts
│   ├── BankFactory.sol
│   ├── CompliantToken.sol
│   └── LendingContract.sol
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── routes/
│   │   ├── bank.js
│   │   ├── customers.js
│   │   ├── tokens.js
│   │   └── lending.js
│   ├── services/
│   │   └── relayer.js
│   └── server.js
├── database/
│   └── schema.sql
├── scripts/
│   └── deploy.js
├── hardhat.config.js
├── package.json
└── README.md
```

## Smart Contract Details

### CompliantToken (ERC-3643 Inspired)

- **KYC Verification**: Only verified addresses can hold/transfer tokens
- **Freeze/Unfreeze**: Compliance controls for freezing addresses
- **Minting**: Controlled minting to verified addresses only
- **Transfer Restrictions**: Enforces verification on all transfers

### LendingContract

- **Collateralized Loans**: Loans backed by tokenized assets
- **Interest Calculation**: Time-based interest calculation
- **Liquidation**: Automatic collateral liquidation on default
- **Loan Management**: Track and manage active loans

### BankFactory

- **One-Click Deployment**: Deploy complete bank setup in one transaction
- **Ownership Management**: Proper contract ownership structure
- **Deployment Tracking**: Track all deployed banks

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **RLS Policies**: Configure appropriate Supabase Row Level Security policies
3. **Access Control**: Implement proper authentication/authorization for API endpoints
4. **Input Validation**: All API endpoints validate input data
5. **Gas Management**: Monitor relayer wallet balance for gas fees

## Testing

```bash
# Run Hardhat tests
npm test

# Test on local Hardhat network
npx hardhat node
```

## Deployment Checklist

- [ ] Deploy Factory contract to Sepolia
- [ ] Update `FACTORY_ADDRESS` in `.env`
- [ ] Fund relayer wallet with Sepolia ETH
- [ ] Set up Supabase project and run schema
- [ ] Configure Supabase RLS policies
- [ ] Test all API endpoints
- [ ] Verify contract interactions on Etherscan

## License

MIT

## Support

For issues and questions, please open an issue in the repository.

