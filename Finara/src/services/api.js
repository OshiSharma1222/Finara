// API service for connecting to Finara backend

const API_BASE_URL = 'http://localhost:3000/api';

class APIService {
  /**
   * Deploy a new bank
   */
  async deployBank(bankAddress, bankName, tokenName, tokenSymbol, maxSupply, collateralizationRatio = 15000) {
    const response = await fetch(`${API_BASE_URL}/deployBank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankAddress,
        bankName,
        tokenName,
        tokenSymbol,
        maxSupply,
        collateralizationRatio
      })
    });
    return response.json();
  }

  /**
   * Upload KYC customers
   */
  async uploadCustomers(bankAddress, customers) {
    const response = await fetch(`${API_BASE_URL}/uploadCustomers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankAddress,
        customers // [{ name, accountId, walletAddress }]
      })
    });
    return response.json();
  }

  /**
   * Get bank details
   */
  async getBankDetails(bankAddress) {
    const response = await fetch(`${API_BASE_URL}/bank/${bankAddress}`);
    return response.json();
  }

  /**
   * Get customers for a bank
   */
  async getCustomers(bankAddress) {
    const response = await fetch(`${API_BASE_URL}/customers/${bankAddress}`);
    return response.json();
  }

  /**
   * Mint tokens to a customer
   */
  async mintTokens(tokenAddress, toAddress, amount) {
    const response = await fetch(`${API_BASE_URL}/mintToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenAddress,
        toAddress,
        amount
      })
    });
    return response.json();
  }

  /**
   * Create a loan
   */
  async createLoan(lendingAddress, borrower, collateralAmount, loanAmount, interestRate, durationDays) {
    const response = await fetch(`${API_BASE_URL}/createLoan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lendingAddress,
        borrower,
        collateralAmount,
        loanAmount,
        interestRate,
        durationDays
      })
    });
    return response.json();
  }

  /**
   * Get loans for a borrower
   */
  async getLoans(borrowerAddress) {
    const response = await fetch(`${API_BASE_URL}/loans/${borrowerAddress}`);
    return response.json();
  }

  /**
   * Repay a loan
   */
  async repayLoan(lendingAddress, loanId) {
    const response = await fetch(`${API_BASE_URL}/repayLoan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lendingAddress,
        loanId
      })
    });
    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck() {
    const response = await fetch('http://localhost:3000/health');
    return response.json();
  }
}

export default new APIService();
