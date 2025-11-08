const Joi = require('joi');

/**
 * Validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    req.validatedBody = value;
    next();
  };
};

/**
 * Validation Schemas
 */

const deployBankSchema = Joi.object({
  bankAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Ethereum address format'
    }),
  bankName: Joi.string().min(2).max(100).required(),
  tokenName: Joi.string().min(2).max(50).required(),
  tokenSymbol: Joi.string().min(1).max(10).uppercase().required(),
  maxSupply: Joi.string().required(),
  collateralizationRatio: Joi.number().integer().min(10000).max(30000).required()
    .messages({
      'number.min': 'Collateralization ratio must be at least 100%',
      'number.max': 'Collateralization ratio cannot exceed 300%'
    })
});

const uploadCustomersSchema = Joi.object({
  bankAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  customers: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(2).max(100).required(),
        accountId: Joi.string().min(1).max(50).required(),
        walletAddress: Joi.string()
          .pattern(/^0x[a-fA-F0-9]{40}$/)
          .required()
      })
    )
    .min(1)
    .required()
});

const mintTokenSchema = Joi.object({
  bankAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  recipientAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  amount: Joi.string().required(),
  assetId: Joi.string().required(),
  assetType: Joi.string().required(),
  metadata: Joi.object().optional()
});

const createLoanSchema = Joi.object({
  bankAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  borrowerAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  collateralAmount: Joi.string().required(),
  loanAmount: Joi.string().required(),
  interestRate: Joi.number().min(0).max(100).required(),
  durationDays: Joi.number().integer().min(1).max(3650).required()
});

const repayLoanSchema = Joi.object({
  amount: Joi.string().required()
});

const createAssetSchema = Joi.object({
  bankAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  assetId: Joi.string().min(1).max(100).required(),
  assetType: Joi.string().min(1).max(50).required(),
  description: Joi.string().max(500).optional(),
  value: Joi.number().positive().required(),
  tokenizedAmount: Joi.string().optional(),
  metadata: Joi.object().optional()
});

const updateAssetStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'tokenized', 'active', 'inactive', 'deleted')
    .required(),
  txHash: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{64}$/)
    .optional()
});

module.exports = {
  validate,
  deployBankSchema,
  uploadCustomersSchema,
  mintTokenSchema,
  createLoanSchema,
  repayLoanSchema,
  createAssetSchema,
  updateAssetStatusSchema
};
