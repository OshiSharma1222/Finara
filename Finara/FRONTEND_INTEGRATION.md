# Frontend Integration Guide

## 🚀 How to Connect Your React Frontend to Backend

### 1. Start Both Servers

#### Terminal 1 - Start Backend:
```bash
cd backend
node server.js
```
Backend runs on: `http://localhost:3000`

#### Terminal 2 - Start Frontend:
```bash
cd Finara
npm run dev
```
Frontend runs on: `http://localhost:5173` (Vite default)

### 2. API Service Usage

Import the API service in any component:

```jsx
import api from '../services/api';
```

### 3. Example Usage in Components

#### Deploy a Bank:
```jsx
import { useState } from 'react';
import api from '../services/api';

function DeployBank() {
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const result = await api.deployBank(
        '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', // bank address
        'My Bank',           // bank name
        'Asset Token',       // token name
        'AST',              // token symbol
        '1000000',          // max supply
        15000               // collateralization ratio (150%)
      );
      
      if (result.success) {
        console.log('Token Address:', result.data.tokenAddress);
        console.log('Lending Address:', result.data.lendingAddress);
        alert('Bank deployed successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDeploy} disabled={loading}>
      {loading ? 'Deploying...' : 'Deploy Bank'}
    </button>
  );
}
```

#### Upload KYC Customers:
```jsx
const handleUploadCustomers = async () => {
  const result = await api.uploadCustomers(
    '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', // bank address
    [
      {
        name: 'Alice Johnson',
        accountId: 'ACC-1001',
        walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
      },
      {
        name: 'Bob Smith',
        accountId: 'ACC-1002',
        walletAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
      }
    ]
  );
  
  if (result.success) {
    alert(`${result.data.verifiedCount} customers verified!`);
  }
};
```

#### Mint Tokens:
```jsx
const handleMintTokens = async () => {
  const result = await api.mintTokens(
    '0xTOKEN_ADDRESS',    // token address from deployment
    '0xCUSTOMER_ADDRESS', // customer wallet
    '100'                 // amount
  );
  
  if (result.success) {
    alert('Tokens minted successfully!');
  }
};
```

#### Create a Loan:
```jsx
const handleCreateLoan = async () => {
  const result = await api.createLoan(
    '0xLENDING_ADDRESS',   // lending contract address
    '0xBORROWER_ADDRESS',  // borrower wallet
    '100',                 // collateral amount
    '60',                  // loan amount
    500,                   // interest rate (5%)
    30                     // duration in days
  );
  
  if (result.success) {
    console.log('Loan ID:', result.data.loanId);
    alert('Loan created!');
  }
};
```

### 4. Integration into BankAdmin.jsx

Add a new section for bank deployment:

```jsx
// In BankAdmin.jsx
import api from '../services/api';
import DeployBankForm from '../components/DeployBankForm';

// Add to your sections:
{section === 'deploy' && (
  <GlassPanel>
    <DeployBankForm />
  </GlassPanel>
)}
```

Update the SideNav to include the new section:
```jsx
<SideNav 
  current={section} 
  onSelect={setSection}
  items={['dashboard', 'onboarding', 'tokenization', 'loans', 'deploy', 'analytics']}
/>
```

### 5. Handle CORS (if needed)

Your backend already has CORS enabled, but if you face issues, make sure:

```javascript
// backend/server.js already has:
app.use(cors());
```

### 6. Full Flow Example

Here's a complete component showing the full workflow:

```jsx
import { useState } from 'react';
import api from '../services/api';
import GlassPanel from '../components/GlassPanel';

export default function BankSetup() {
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Deploy Bank
  const deployBank = async () => {
    setLoading(true);
    const result = await api.deployBank(
      '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
      'Test Bank',
      'Asset Token',
      'AST',
      '1000000',
      15000
    );
    
    if (result.success) {
      setBankData(result.data);
      alert('✅ Bank deployed!');
    }
    setLoading(false);
  };

  // Step 2: Upload Customers
  const uploadCustomers = async () => {
    if (!bankData) return alert('Deploy bank first!');
    
    setLoading(true);
    const result = await api.uploadCustomers(
      bankData.bankAddress,
      [
        {
          name: 'Alice Johnson',
          accountId: 'ACC-1001',
          walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
        }
      ]
    );
    
    if (result.success) {
      alert('✅ Customers uploaded and verified!');
    }
    setLoading(false);
  };

  // Step 3: Mint Tokens
  const mintTokens = async () => {
    if (!bankData) return alert('Deploy bank first!');
    
    setLoading(true);
    const result = await api.mintTokens(
      bankData.tokenAddress,
      '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      '100'
    );
    
    if (result.success) {
      alert('✅ Tokens minted!');
    }
    setLoading(false);
  };

  return (
    <GlassPanel>
      <h2>Bank Setup Wizard</h2>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn" onClick={deployBank} disabled={loading}>
          1. Deploy Bank
        </button>
        <button className="btn" onClick={uploadCustomers} disabled={loading || !bankData}>
          2. Upload Customers
        </button>
        <button className="btn" onClick={mintTokens} disabled={loading || !bankData}>
          3. Mint Tokens
        </button>
      </div>

      {bankData && (
        <div style={{ background: 'rgba(199,255,58,0.1)', padding: 15, borderRadius: 8 }}>
          <div><strong>Bank:</strong> {bankData.bankName}</div>
          <div><strong>Token:</strong> {bankData.tokenAddress}</div>
          <div><strong>Lending:</strong> {bankData.lendingAddress}</div>
        </div>
      )}
    </GlassPanel>
  );
}
```

### 7. Testing Checklist

✅ Backend running on `http://localhost:3000`  
✅ Frontend running on `http://localhost:5173`  
✅ Hardhat node running (for blockchain)  
✅ Import API service in components  
✅ Handle loading states  
✅ Show success/error messages  
✅ Display results to users  

### 8. Next Steps

1. Start both servers
2. Open browser to `http://localhost:5173`
3. Navigate to Bank Admin section
4. Use the DeployBankForm component
5. Test the full workflow!

🎉 Your frontend is now connected to the backend!
