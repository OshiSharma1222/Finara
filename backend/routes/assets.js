const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

/**
 * POST /api/assets
 * Create a new verified asset
 */
router.post('/', async (req, res) => {
  try {
    const {
      bankAddress,
      assetId,
      assetType,
      description,
      value,
      tokenizedAmount,
      metadata
    } = req.body;

    if (!bankAddress || !assetId || !assetType || !value) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bankAddress, assetId, assetType, value'
      });
    }

    const { data, error } = await supabase
      .from('assets')
      .insert({
        bank_address: bankAddress.toLowerCase(),
        asset_id: assetId,
        asset_type: assetType,
        description: description || '',
        value: value,
        tokenized_amount: tokenizedAmount || '0',
        metadata: metadata || {},
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data
    });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/assets/bank/:bankAddress
 * Get all assets for a specific bank
 */
router.get('/bank/:bankAddress', async (req, res) => {
  try {
    const { bankAddress } = req.params;
    const { status, assetType } = req.query;

    let query = supabase
      .from('assets')
      .select('*')
      .eq('bank_address', bankAddress.toLowerCase());

    if (status) {
      query = query.eq('status', status);
    }
    if (assetType) {
      query = query.eq('asset_type', assetType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/assets/:assetId
 * Get specific asset details
 */
router.get('/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('asset_id', assetId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/assets/:assetId/status
 * Update asset status
 */
router.put('/:assetId/status', async (req, res) => {
  try {
    const { assetId } = req.params;
    const { status, txHash } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (txHash) {
      updateData.tx_hash = txHash;
    }

    const { data, error } = await supabase
      .from('assets')
      .update(updateData)
      .eq('asset_id', assetId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Asset status updated',
      data
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/assets/:assetId
 * Delete an asset (soft delete)
 */
router.delete('/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;

    const { data, error } = await supabase
      .from('assets')
      .update({
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('asset_id', assetId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Asset deleted successfully',
      data
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
