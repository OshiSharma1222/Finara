import React, { useState } from 'react';
import GlassPanel from '../components/GlassPanel';
import '../styles/theme.css';

const kycQueue = [
  { id: 'KYC-001', name: 'Alice Johnson', wallet: '0xA1b2...c3D4', status: 'Pending', risk: 'Low' },
  { id: 'KYC-002', name: 'Bob Smith', wallet: '0xE5f6...g7H8', status: 'Pending', risk: 'Medium' },
  { id: 'KYC-003', name: 'Charlie Davis', wallet: '0xI9j0...k1L2', status: 'Under Review', risk: 'Low' },
];

const auditLogs = [
  { timestamp: '2025-11-08 14:32', action: 'Token Freeze', user: 'admin@bank.com', target: '0xA1b2...', txHash: '0xabc123...' },
  { timestamp: '2025-11-08 12:15', action: 'KYC Approved', user: 'compliance@bank.com', target: 'KYC-005', txHash: '0xdef456...' },
  { timestamp: '2025-11-07 18:45', action: 'Loan Liquidation', user: 'admin@bank.com', target: '#L042', txHash: '0xghi789...' },
  { timestamp: '2025-11-07 16:20', action: 'Account Unfreeze', user: 'compliance@bank.com', target: '0xC3d4...', txHash: '0xjkl012...' },
];

export default function ComplianceReports(){
  const [selectedKYC, setSelectedKYC] = useState(null);

  return (
    <div style={{padding:'24px 48px',maxWidth:'1400px',margin:'0 auto'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:'0 0 6px'}}>Compliance & Reports</h2>
        <div className="small-muted">Manage KYC approvals, freeze controls, and export audit logs</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:16}}>
        <GlassPanel>
          <h3 style={{marginTop:0,marginBottom:16}}>KYC Approval Queue</h3>
          <div className="small-muted" style={{marginBottom:16}}>Review pending KYC applications and approve or freeze accounts</div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Wallet</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycQueue.map((kyc, i) => (
                <tr key={i}>
                  <td className="small-muted">{kyc.id}</td>
                  <td style={{fontWeight:600}}>{kyc.name}</td>
                  <td className="small-muted">{kyc.wallet}</td>
                  <td>
                    <span style={{padding:'4px 8px',borderRadius:6,background: kyc.risk === 'Low' ? 'rgba(155,225,43,0.1)' : 'rgba(255,200,58,0.1)',color: kyc.risk === 'Low' ? 'var(--accent)' : '#ffc83a',fontSize:'0.85rem'}}>
                      {kyc.risk}
                    </span>
                  </td>
                  <td>
                    <span style={{padding:'4px 8px',borderRadius:6,background:'rgba(199,255,58,0.1)',color:'var(--accent)',fontSize:'0.85rem'}}>
                      {kyc.status}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn primary" style={{fontSize:'0.85rem',padding:'6px 10px'}}>✓ Approve</button>
                      <button className="btn" style={{fontSize:'0.85rem',padding:'6px 10px'}}>✕ Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>

        <GlassPanel>
          <h4 style={{marginTop:0,marginBottom:16}}>Quick Stats</h4>
          <div style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
            <div className="small-muted">Pending KYC</div>
            <div style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>3</div>
          </div>
          <div style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
            <div className="small-muted">Approved Today</div>
            <div style={{fontSize:'1.8rem',fontWeight:700}}>7</div>
          </div>
          <div style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
            <div className="small-muted">Frozen Accounts</div>
            <div style={{fontSize:'1.8rem',fontWeight:700}}>2</div>
          </div>
          <div style={{padding:'12px 0'}}>
            <div className="small-muted">Total Audits</div>
            <div style={{fontSize:'1.8rem',fontWeight:700}}>142</div>
          </div>
        </GlassPanel>
      </div>

      <div className="grid">
        <div className="col-8">
          <GlassPanel>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div>
                <h3 style={{margin:'0 0 4px'}}>Audit Logs</h3>
                <div className="small-muted">Exportable CSV/PDF with signed on-chain references</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" style={{fontSize:'0.9rem'}}>📄 Export CSV</button>
                <button className="btn" style={{fontSize:'0.9rem'}}>📕 Export PDF</button>
              </div>
            </div>
            <div style={{maxHeight:300,overflowY:'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Target</th>
                    <th>Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={i}>
                      <td className="small-muted">{log.timestamp}</td>
                      <td style={{fontWeight:600}}>{log.action}</td>
                      <td className="small-muted">{log.user}</td>
                      <td>{log.target}</td>
                      <td className="small-muted">{log.txHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>

        <div className="col-4">
          <GlassPanel>
            <h4 style={{marginTop:0,marginBottom:16}}>Freeze Controls</h4>
            <div className="small-muted" style={{marginBottom:16}}>Freeze/unfreeze tokens or accounts by audit ID</div>
            <div style={{marginBottom:12}}>
              <label style={{display:'block',marginBottom:6,fontWeight:600,fontSize:'0.9rem'}}>Wallet Address</label>
              <input type="text" placeholder="0x..." className="btn" style={{width:'100%',padding:'10px'}} />
            </div>
            <div style={{marginBottom:12}}>
              <label style={{display:'block',marginBottom:6,fontWeight:600,fontSize:'0.9rem'}}>Reason</label>
              <select className="btn" style={{width:'100%',textAlign:'left',padding:'10px'}}>
                <option>Suspicious Activity</option>
                <option>Regulatory Hold</option>
                <option>Court Order</option>
                <option>Risk Assessment</option>
              </select>
            </div>
            <button className="btn primary" style={{width:'100%',marginBottom:8}}>🔒 Freeze Account</button>
            <button className="btn" style={{width:'100%'}}>🔓 Unfreeze Account</button>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
