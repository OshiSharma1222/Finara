const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const relayer = require('../services/relayer');
const supabase = require('../config/supabase');

/**
 * POST /lend
 * Create a loan against tokenized assets
 */
router.post('/lend', async (req, res) => {
  try {
    const {
      bankAddress,
      borrowerAddress,
      collateralAmount,
      loanAmount,
      interestRate, // in basis points (e.g., 500 = 5%)
      duration // in seconds
    } = req.body;
    
    // Validate input
    if (!bankAddress || !borrowerAddress || !collateralAmount || !loanAmount || !interestRate || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bankAddress, borrowerAddress, collateralAmount, loanAmount, interestRate, duration'
      });
    }
    
    if (collateralAmount <= 0 || loanAmount <= 0 || interestRate <= 0 || duration <= 0) {
      return res.status(400).json({
        success: false,
        error: 'All amounts and rates must be greater than 0'
      });
    }
    
    // Check if bank exists
    const { data: bank } = await supabase
      .from('banks')
      .select('lending_address, collateralization_ratio')
      .eq('bank_address', bankAddress)
      .single();
    
    if (!bank) {
      return res.status(404).json({
        success: false,
        error: 'Bank not found'
      });
    }
    
    // Check if borrower is verified
    const { data: borrower } = await supabase
      .from('customers')
      .select('*')
      .eq('bank_address', bankAddress)
      .eq('wallet_address', borrowerAddress.toLowerCase())
      .eq('kyc_verified', true)
      .single();
    
    if (!borrower) {
      return res.status(403).json({
        success: false,
        error: 'Borrower not found or not KYC verified'
      });
    }
    
    // Verify borrower has sufficient balance for collateral
    const { data: bankData } = await supabase
      .from('banks')
      .select('token_address')
      .eq('bank_address', bankAddress)
      .single();
    
    if (!bankData || !bankData.token_address) {
      return res.status(404).json({
        success: false,
        error: 'Bank token address not found'
      });
    }
    
    const tokenContract = relayer.getTokenContract(bankData.token_address);
    const balance = await tokenContract.balanceOf(borrowerAddress);
    const requiredCollateral = ethers.parseEther(collateralAmount.toString());
    
    if (balance < requiredCollateral) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient token balance for collateral'
      });
    }
    
    // Create loan via relayer
    const loanResult = await relayer.createLoan(
      bank.lending_address,
      borrowerAddress,
      collateralAmount,
      loanAmount,
      interestRate,
      duration
    );
    
    if (!loanResult.success) {
      return res.status(500).json({
        success: false,
        error: loanResult.error
      });
    }
    
    // Record loan in database
    const { data: loanRecord, error: dbError } = await supabase
      .from('loans')
      .insert({
        bank_address: bankAddress,
        borrower_address: borrowerAddress.toLowerCase(),
        loan_id: loanResult.loanId,
        collateral_amount: collateralAmount,
        loan_amount: loanAmount,
        interest_rate: interestRate,
        duration: duration,
        transaction_hash: loanResult.transactionHash,
        block_number: loanResult.blockNumber,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if DB write fails
    }
    
    res.json({
      success: true,
      message: 'Loan created successfully',
      data: {
        loanId: loanResult.loanId,
        borrowerAddress,
        collateralAmount,
        loanAmount,
        interestRate,
        duration,
        transactionHash: loanResult.transactionHash,
        blockNumber: loanResult.blockNumber,
        loanRecord
      }
    });
  } catch (error) {
    console.error('Error in /lend:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /loans/:bankAddress
 * Get all loans for a bank
 */
router.get('/loans/:bankAddress', async (req, res) => {
  try {
    const { bankAddress } = req.params;
    
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('bank_address', bankAddress)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
    
    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error in /loans/:bankAddress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /loans/:bankAddress/:borrowerAddress
 * Get loans for a specific borrower
 */
router.get('/loans/:bankAddress/:borrowerAddress', async (req, res) => {
  try {
    const { bankAddress, borrowerAddress } = req.params;
    
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('bank_address', bankAddress)
      .eq('borrower_address', borrowerAddress.toLowerCase())
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
    
    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error in /loans/:bankAddress/:borrowerAddress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

