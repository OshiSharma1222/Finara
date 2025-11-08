-- Finara Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Banks table
CREATE TABLE IF NOT EXISTS banks (
    id BIGSERIAL PRIMARY KEY,
    bank_address TEXT NOT NULL UNIQUE,
    bank_name TEXT NOT NULL,
    token_address TEXT NOT NULL,
    lending_address TEXT NOT NULL,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    max_supply NUMERIC NOT NULL,
    collateralization_ratio INTEGER NOT NULL DEFAULT 15000,
    factory_transaction_hash TEXT,
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers table (KYC verified)
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    bank_address TEXT NOT NULL,
    name TEXT NOT NULL,
    account_id TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    kyc_verified BOOLEAN NOT NULL DEFAULT true,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(wallet_address, bank_address)
);

-- Token mints table
CREATE TABLE IF NOT EXISTS token_mints (
    id BIGSERIAL PRIMARY KEY,
    bank_address TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    transaction_hash TEXT NOT NULL,
    block_number BIGINT,
    minted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
    id BIGSERIAL PRIMARY KEY,
    bank_address TEXT NOT NULL,
    borrower_address TEXT NOT NULL,
    loan_id TEXT NOT NULL,
    collateral_amount NUMERIC NOT NULL,
    loan_amount NUMERIC NOT NULL,
    interest_rate INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    transaction_hash TEXT NOT NULL,
    block_number BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assets table (for storing verified asset data)
CREATE TABLE IF NOT EXISTS assets (
    id BIGSERIAL PRIMARY KEY,
    bank_address TEXT NOT NULL,
    asset_id TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    description TEXT,
    value NUMERIC NOT NULL,
    tokenized_amount NUMERIC,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(bank_address, asset_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_bank_address ON customers(bank_address);
CREATE INDEX IF NOT EXISTS idx_customers_wallet_address ON customers(wallet_address);
CREATE INDEX IF NOT EXISTS idx_token_mints_bank_address ON token_mints(bank_address);
CREATE INDEX IF NOT EXISTS idx_token_mints_wallet_address ON token_mints(wallet_address);
CREATE INDEX IF NOT EXISTS idx_loans_bank_address ON loans(bank_address);
CREATE INDEX IF NOT EXISTS idx_loans_borrower_address ON loans(borrower_address);
CREATE INDEX IF NOT EXISTS idx_assets_bank_address ON assets(bank_address);

-- Enable Row Level Security (RLS) - adjust policies based on your needs
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_mints ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Create policies (example: allow all operations for service role)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all for service role" ON banks FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON token_mints FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON loans FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON assets FOR ALL USING (true);

