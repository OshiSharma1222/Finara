const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const relayer = require('../services/relayer');
const supabase = require('../config/supabase');

/**
 * POST /mintToken
 * Mint tokens to a verified customer
 */
router.post('/mintToken', async (req, res) => {
  try {
    const {
      bankAddress,
      walletAddress,
      amount
    } = req.body;
    
    // Validate input
    if (!bankAddress || !walletAddress || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bankAddress, walletAddress, amount'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }
    
    // Check if bank exists
    const { data: bank } = await supabase
      .from('banks')
      .select('token_address')
      .eq('bank_address', bankAddress)
      .single();
    
    if (!bank) {
      return res.status(404).json({
        success: false,
        error: 'Bank not found'
      });
    }
    
    // Check if customer is verified
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('bank_address', bankAddress)
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('kyc_verified', true)
      .single();
    
    if (!customer) {
      return res.status(403).json({
        success: false,
        error: 'Customer not found or not KYC verified'
      });
    }
    
    // Mint tokens via relayer
    const mintResult = await relayer.mintToken(
      bank.token_address,
      walletAddress,
      amount
    );
    
    if (!mintResult.success) {
      return res.status(500).json({
        success: false,
        error: mintResult.error
      });
    }
    
    // Record minting in database
    const { error: dbError } = await supabase
      .from('token_mints')
      .insert({
        bank_address: bankAddress,
        wallet_address: walletAddress.toLowerCase(),
        amount: amount,
        transaction_hash: mintResult.transactionHash,
        block_number: mintResult.blockNumber,
        minted_at: new Date().toISOString()
      });
    
    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if DB write fails
    }
    
    res.json({
      success: true,
      message: `Successfully minted ${amount} tokens to ${walletAddress}`,
      data: {
        walletAddress,
        amount,
        transactionHash: mintResult.transactionHash,
        blockNumber: mintResult.blockNumber
      }
    });
  } catch (error) {
    console.error('Error in /mintToken:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /tokenBalance/:bankAddress/:walletAddress
 * Get token balance for a wallet
 */
router.get('/tokenBalance/:bankAddress/:walletAddress', async (req, res) => {
  try {
    const { bankAddress, walletAddress } = req.params;
    
    // Get bank token address
    const { data: bank } = await supabase
      .from('banks')
      .select('token_address')
      .eq('bank_address', bankAddress)
      .single();
    
    if (!bank) {
      return res.status(404).json({
        success: false,
        error: 'Bank not found'
      });
    }
    
    // Get balance from blockchain
    const tokenContract = relayer.getTokenContract(bank.token_address);
    const balance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    
    res.json({
      success: true,
      data: {
        walletAddress,
        balance: ethers.formatEther(balance),
        balanceRaw: balance.toString()
      }
    });
  } catch (error) {
    console.error('Error in /tokenBalance:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

