const { ethers } = require('ethers');
require('dotenv').config();

/**
 * Relayer service for handling blockchain transactions
 * This service uses a private key to sign and send transactions
 * without requiring MetaMask or user gas fees
 */
class RelayerService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'
    );
    
    if (!process.env.RELAYER_PRIVATE_KEY) {
      throw new Error('RELAYER_PRIVATE_KEY is required in environment variables');
    }
    
    this.wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, this.provider);
    this.factoryAddress = process.env.FACTORY_ADDRESS;
    
    // Load contract ABIs
    this.factoryABI = require('../../artifacts/contracts/BankFactory.sol/BankFactory.json').abi;
    this.tokenABI = require('../../artifacts/contracts/CompliantToken.sol/CompliantToken.json').abi;
    this.lendingABI = require('../../artifacts/contracts/LendingContract.sol/LendingContract.json').abi;
    
    this.factoryContract = new ethers.Contract(
      this.factoryAddress,
      this.factoryABI,
      this.wallet
    );
  }
  
  /**
   * Get the relayer wallet address
   */
  getRelayerAddress() {
    return this.wallet.address;
  }
  
  /**
   * Get the current balance of the relayer wallet
   */
  async getBalance() {
    return await this.provider.getBalance(this.wallet.address);
  }
  
  /**
   * Deploy a new bank setup
   */
  async deployBank(bankAddress, bankName, tokenName, tokenSymbol, maxSupply, collateralizationRatio) {
    try {
      const tx = await this.factoryContract.deployBank(
        bankAddress,
        bankName,
        tokenName,
        tokenSymbol,
        ethers.parseEther(maxSupply.toString()),
        collateralizationRatio
      );
      
      const receipt = await tx.wait();
      
      // Extract token and lending addresses from events
      const event = receipt.logs.find(
        log => {
          try {
            const parsed = this.factoryContract.interface.parseLog(log);
            return parsed && parsed.name === 'BankDeployed';
          } catch {
            return false;
          }
        }
      );
      
      if (event) {
        const parsed = this.factoryContract.interface.parseLog(event);
        return {
          success: true,
          transactionHash: receipt.hash,
          tokenAddress: parsed.args.tokenAddress,
          lendingAddress: parsed.args.lendingAddress,
          blockNumber: receipt.blockNumber
        };
      }
      
      // Fallback: query the factory
      const deployment = await this.factoryContract.getBankDeployment(bankAddress);
      return {
        success: true,
        transactionHash: receipt.hash,
        tokenAddress: deployment.tokenAddress,
        lendingAddress: deployment.lendingAddress,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error deploying bank:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Authorize relayer on a token contract
   */
  async authorizeRelayer(tokenAddress) {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, this.tokenABI, this.wallet);
      
      const tx = await tokenContract.addAuthorizedVerifier(this.wallet.address);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error authorizing relayer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Verify customer addresses on the token contract
   */
  async verifyCustomers(tokenAddress, addresses) {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, this.tokenABI, this.wallet);
      
      const tx = await tokenContract.batchVerifyAddresses(addresses);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        verifiedCount: addresses.length
      };
    } catch (error) {
      console.error('Error verifying customers:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Mint tokens to a verified address
   */
  async mintToken(tokenAddress, toAddress, amount) {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, this.tokenABI, this.wallet);
      
      const tx = await tokenContract.mint(
        toAddress,
        ethers.parseEther(amount.toString())
      );
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        amount: amount,
        recipient: toAddress
      };
    } catch (error) {
      console.error('Error minting token:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Create a loan
   */
  async createLoan(lendingAddress, borrower, collateralAmount, loanAmount, interestRate, duration) {
    try {
      const lendingContract = new ethers.Contract(lendingAddress, this.lendingABI, this.wallet);
      
      const tx = await lendingContract.createLoan(
        borrower,
        ethers.parseEther(collateralAmount.toString()),
        ethers.parseEther(loanAmount.toString()),
        interestRate, // in basis points
        duration // in seconds
      );
      const receipt = await tx.wait();
      
      // Extract loan ID from events
      const event = receipt.logs.find(
        log => {
          try {
            const parsed = lendingContract.interface.parseLog(log);
            return parsed && parsed.name === 'LoanCreated';
          } catch {
            return false;
          }
        }
      );
      
      let loanId = null;
      if (event) {
        const parsed = lendingContract.interface.parseLog(event);
        loanId = parsed.args.loanId.toString();
      }
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        loanId: loanId
      };
    } catch (error) {
      console.error('Error creating loan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get token contract instance
   */
  getTokenContract(tokenAddress) {
    return new ethers.Contract(tokenAddress, this.tokenABI, this.provider);
  }
  
  /**
   * Get lending contract instance
   */
  getLendingContract(lendingAddress) {
    return new ethers.Contract(lendingAddress, this.lendingABI, this.provider);
  }
  
  /**
   * Get factory contract instance
   */
  getFactoryContract() {
    return this.factoryContract;
  }
}

module.exports = new RelayerService();

