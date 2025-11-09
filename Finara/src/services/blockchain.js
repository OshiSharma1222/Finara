// Blockchain transaction service
// Simulates recording transactions on blockchain and generating transaction hashes

const BLOCKCHAIN_STORAGE_KEY = 'finara_blockchain_txns';

// Generate a mock transaction hash (in production, this would come from actual blockchain)
function generateTxHash() {
  const prefix = '0x';
  const chars = '0123456789abcdef';
  let hash = prefix;
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Get all blockchain transactions
function getBlockchainTransactions() {
  try {
    const raw = localStorage.getItem(BLOCKCHAIN_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('blockchain: read error', e);
    return [];
  }
}

// Save blockchain transactions
function saveBlockchainTransactions(txns) {
  localStorage.setItem(BLOCKCHAIN_STORAGE_KEY, JSON.stringify(txns));
}

// Record a transaction on blockchain
function recordTransaction({ 
  type, // 'ASSET_LISTING', 'ASSET_SALE', 'ASSET_PURCHASE', 'TOKEN_MINT', 'LOAN_CREATE'
  from, 
  to, 
  assetType, 
  assetId,
  amount, 
  tokens,
  metadata = {} 
}) {
  const txn = {
    txHash: generateTxHash(),
    type,
    from,
    to,
    assetType,
    assetId,
    amount,
    tokens,
    metadata,
    timestamp: Date.now(),
    blockNumber: Math.floor(Date.now() / 15000), // Mock block number (1 block per 15 seconds)
    confirmations: 1,
    status: 'confirmed',
    gasUsed: Math.floor(Math.random() * 50000) + 21000, // Mock gas
    gasFee: (Math.random() * 0.01 + 0.001).toFixed(6) + ' ETH'
  };

  const txns = getBlockchainTransactions();
  txns.push(txn);
  saveBlockchainTransactions(txns);

  return txn;
}

// Get transactions for a specific account
function getAccountTransactions(accountId) {
  if (!accountId) return [];
  const txns = getBlockchainTransactions();
  return txns.filter(t => t.from === accountId || t.to === accountId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

// Get transaction by hash
function getTransactionByHash(txHash) {
  const txns = getBlockchainTransactions();
  return txns.find(t => t.txHash === txHash);
}

// Verify transaction on blockchain (mock verification)
function verifyTransaction(txHash) {
  const txn = getTransactionByHash(txHash);
  if (!txn) return { verified: false, error: 'Transaction not found' };
  
  return {
    verified: true,
    txHash: txn.txHash,
    blockNumber: txn.blockNumber,
    confirmations: Math.min(12, Math.floor((Date.now() - txn.timestamp) / 15000) + 1),
    status: txn.status,
    timestamp: txn.timestamp
  };
}

// Clear all blockchain data (for testing)
function clearBlockchainData() {
  localStorage.removeItem(BLOCKCHAIN_STORAGE_KEY);
}

// Get blockchain explorer URL (mock)
function getExplorerUrl(txHash) {
  return `https://etherscan.io/tx/${txHash}`;
}

export default {
  recordTransaction,
  getAccountTransactions,
  getTransactionByHash,
  verifyTransaction,
  clearBlockchainData,
  getExplorerUrl
};
