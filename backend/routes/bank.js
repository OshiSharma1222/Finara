const express = require('express');
const router = express.Router();
const relayer = require('../services/relayer');
const supabase = require('../config/supabase');

/**
 * POST /deployBank
 * Deploy a new bank setup (Token + Lending contracts)
 */
router.post('/deployBank', async (req, res) => {
  try {
    const {
      bankAddress,
      bankName,
      tokenName,
      tokenSymbol,
      maxSupply,
      collateralizationRatio = 15000 // Default 150% (1.5x)
    } = req.body;
    
    // Validate input
    if (!bankAddress || !bankName || !tokenName || !tokenSymbol || !maxSupply) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bankAddress, bankName, tokenName, tokenSymbol, maxSupply'
      });
    }
    
    // Check if bank already exists
    const { data: existingBank } = await supabase
      .from('banks')
      .select('*')
      .eq('bank_address', bankAddress)
      .single();
    
    if (existingBank) {
      return res.status(400).json({
        success: false,
        error: 'Bank already deployed'
      });
    }
    
    // Deploy contracts via relayer
    const deployment = await relayer.deployBank(
      bankAddress,
      bankName,
      tokenName,
      tokenSymbol,
      maxSupply,
      collateralizationRatio
    );
    
    if (!deployment.success) {
      return res.status(500).json({
        success: false,
        error: deployment.error
      });
    }
    
    // Authorize relayer on the token contract
    const authResult = await relayer.authorizeRelayer(deployment.tokenAddress);
    if (!authResult.success) {
      console.warn('Failed to authorize relayer:', authResult.error);
      // Don't fail the deployment, just warn
    }
    
    // Store bank info in Supabase
    const { data: bankData, error: dbError } = await supabase
      .from('banks')
      .insert({
        bank_address: bankAddress,
        bank_name: bankName,
        token_address: deployment.tokenAddress,
        lending_address: deployment.lendingAddress,
        token_name: tokenName,
        token_symbol: tokenSymbol,
        max_supply: maxSupply,
        collateralization_ratio: collateralizationRatio,
        factory_transaction_hash: deployment.transactionHash,
        deployed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Failed to store bank data: ' + dbError.message
      });
    }
    
    res.json({
      success: true,
      message: 'Bank deployed successfully',
      data: {
        bankAddress,
        tokenAddress: deployment.tokenAddress,
        lendingAddress: deployment.lendingAddress,
        transactionHash: deployment.transactionHash,
        blockNumber: deployment.blockNumber,
        bankId: bankData.id
      }
    });
  } catch (error) {
    console.error('Error in /deployBank:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /banks
 * Get all deployed banks
 */
router.get('/banks', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .order('deployed_at', { ascending: false });
    
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
    console.error('Error in /banks:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /banks/:bankAddress
 * Get bank details by address
 */
router.get('/banks/:bankAddress', async (req, res) => {
  try {
    const { bankAddress } = req.params;
    
    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .eq('bank_address', bankAddress)
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Bank not found'
      });
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in /banks/:bankAddress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

