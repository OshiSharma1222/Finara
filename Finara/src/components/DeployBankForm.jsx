import React, { useState } from 'react';
import api from '../services/api';

export default function DeployBankForm() {
  const [formData, setFormData] = useState({
    bankAddress: '',
    bankName: '',
    tokenName: '',
    tokenSymbol: '',
    maxSupply: '1000000',
    collateralizationRatio: 15000
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await api.deployBank(
        formData.bankAddress,
        formData.bankName,
        formData.tokenName,
        formData.tokenSymbol,
        formData.maxSupply,
        parseInt(formData.collateralizationRatio)
      );

      setResult(response);
      
      if (response.success) {
        alert('Bank deployed successfully!');
        console.log('Token Address:', response.data.tokenAddress);
        console.log('Lending Address:', response.data.lendingAddress);
      } else {
        alert('Error: ' + response.error);
      }
    } catch (error) {
      setResult({ success: false, error: error.message });
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Deploy New Bank</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Bank Address (Ethereum)</label>
          <input
            type="text"
            value={formData.bankAddress}
            onChange={(e) => setFormData({ ...formData, bankAddress: e.target.value })}
            placeholder="0x..."
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Bank Name</label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            placeholder="My Bank"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Token Name</label>
          <input
            type="text"
            value={formData.tokenName}
            onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
            placeholder="Asset Token"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Token Symbol</label>
          <input
            type="text"
            value={formData.tokenSymbol}
            onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
            placeholder="AST"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Max Supply</label>
          <input
            type="text"
            value={formData.maxSupply}
            onChange={(e) => setFormData({ ...formData, maxSupply: e.target.value })}
            placeholder="1000000"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Deploying...' : 'Deploy Bank'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20, padding: 15, background: result.success ? '#d4edda' : '#f8d7da', borderRadius: 8 }}>
          <pre style={{ fontSize: 12, overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
