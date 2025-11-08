const express = require('express');
const router = express.Router();
const relayer = require('../services/relayer');
const supabase = require('../config/supabase');

/**
 * POST /uploadCustomers
 * Upload KYCed customers for a bank
 */
router.post('/uploadCustomers', async (req, res) => {
  try {
    const {
      bankAddress,
      customers // Array of { name, accountId, walletAddress }
    } = req.body;
    
    // Validate input
    if (!bankAddress || !customers || !Array.isArray(customers) || customers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bankAddress and customers array'
      });
    }
    
    // Validate each customer
    for (const customer of customers) {
      if (!customer.name || !customer.accountId || !customer.walletAddress) {
        return res.status(400).json({
          success: false,
          error: 'Each customer must have: name, accountId, walletAddress'
        });
      }
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
        error: 'Bank not found. Please deploy the bank first.'
      });
    }
    
    // Prepare customer data for database
    const customerRecords = customers.map(customer => ({
      bank_address: bankAddress,
      name: customer.name,
      account_id: customer.accountId,
      wallet_address: customer.walletAddress.toLowerCase(),
      kyc_verified: true,
      verified_at: new Date().toISOString()
    }));
    
    // Insert customers into database
    const { data: insertedCustomers, error: dbError } = await supabase
      .from('customers')
      .upsert(customerRecords, {
        onConflict: 'wallet_address,bank_address',
        ignoreDuplicates: false
      })
      .select();
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Failed to store customers: ' + dbError.message
      });
    }
    
    // Verify addresses on blockchain
    const walletAddresses = customers.map(c => c.walletAddress);
    const verification = await relayer.verifyCustomers(bank.token_address, walletAddresses);
    
    if (!verification.success) {
      // Log error but don't fail the request - customers are stored in DB
      console.error('Blockchain verification error:', verification.error);
      return res.status(500).json({
        success: false,
        error: 'Customers stored but blockchain verification failed: ' + verification.error,
        data: {
          customers: insertedCustomers,
          verificationError: verification.error
        }
      });
    }
    
    res.json({
      success: true,
      message: `Successfully uploaded and verified ${customers.length} customers`,
      data: {
        customers: insertedCustomers,
        verification: {
          transactionHash: verification.transactionHash,
          blockNumber: verification.blockNumber,
          verifiedCount: verification.verifiedCount
        }
      }
    });
  } catch (error) {
    console.error('Error in /uploadCustomers:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /customers/:bankAddress
 * Get all customers for a bank
 */
router.get('/customers/:bankAddress', async (req, res) => {
  try {
    const { bankAddress } = req.params;
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('bank_address', bankAddress)
      .order('verified_at', { ascending: false });
    
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
    console.error('Error in /customers/:bankAddress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /customers/:bankAddress/:walletAddress
 * Get customer details
 */
router.get('/customers/:bankAddress/:walletAddress', async (req, res) => {
  try {
    const { bankAddress, walletAddress } = req.params;
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('bank_address', bankAddress)
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in /customers/:bankAddress/:walletAddress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

