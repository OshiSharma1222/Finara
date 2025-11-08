import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassPanel from '../components/GlassPanel';
import Card from '../components/Card';
import '../styles/theme.css';

const transactionHistory = [
  { date: '2025-11-01', type: 'Mint', amount: 50, hash: '0xabc123...' },
  { date: '2025-10-15', type: 'Loan Disbursement', amount: -120, hash: '0xdef456...' },
  { date: '2025-10-02', type: 'EMI Payment', amount: -15, hash: '0xghi789...' },
  { date: '2025-09-20', type: 'Mint', amount: 80, hash: '0xjkl012...' },
];

const walletHistory = [
  { month: 'Jul', balance: 50 },
  { month: 'Aug', balance: 95 },
  { month: 'Sep', balance: 130 },
  { month: 'Oct', balance: 115 },
  { month: 'Nov', balance: 120 },
];

export default function CustomerPortal(){
  return (
    <div style={{padding:'24px 48px',maxWidth:'1400px',margin:'0 auto'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:'0 0 6px'}}>Customer Portal</h2>
        <div className="small-muted">Manage your digital wallet, view transactions, and apply for loans</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16}}>
        <Card title="Digital Wallet" subtitle="Tokenized holdings">
          <div style={{display:'flex',alignItems:'center',gap:12,marginTop:8}}>
            <div className="holo-token" style={{width:72,height:72}}>
              <div style={{fontSize:'1.5rem'}}>💎</div>
            </div>
            <div>
              <div style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>120.5 FNA</div>
              <div className="small-muted">≈ $12,400 USD</div>
            </div>
          </div>
        </Card>
        <Card title="EMI Schedule" subtitle="Upcoming payments">
          <div style={{marginTop:8}}>
            <div style={{fontSize:'1.4rem',fontWeight:700,marginBottom:4}}>$350</div>
            <div className="small-muted">Next EMI: Dec 10, 2025</div>
            <button className="btn" style={{marginTop:10,fontSize:'0.9rem'}}>Pay Now</button>
          </div>
        </Card>
        <Card title="Quick Actions">
          <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
            <button className="btn primary" style={{fontSize:'0.95rem'}}>Apply for Loan</button>
            <button className="btn" style={{fontSize:'0.95rem'}}>Request KYC Update</button>
            <button className="btn" style={{fontSize:'0.95rem'}}>View Documents</button>
          </div>
        </Card>
      </div>

      <div className="grid">
        <div className="col-7">
          <GlassPanel>
            <h3 style={{marginTop:0,marginBottom:16}}>Wallet Balance History</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={walletHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--muted)" style={{fontSize:12}} />
                <YAxis stroke="var(--muted)" style={{fontSize:12}} />
                <Tooltip 
                  contentStyle={{background:'rgba(11,15,18,0.95)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff'}}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--accent)" strokeWidth={2} dot={{fill:'var(--accent)',r:4}} />
              </LineChart>
            </ResponsiveContainer>
          </GlassPanel>

          <div style={{height:16}} />

          <GlassPanel>
            <h3 style={{marginTop:0,marginBottom:16}}>Transaction History</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((tx, i) => (
                  <tr key={i}>
                    <td className="small-muted">{tx.date}</td>
                    <td>{tx.type}</td>
                    <td style={{color: tx.amount > 0 ? 'var(--accent)' : 'var(--muted)', fontWeight:600}}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} FNA
                    </td>
                    <td className="small-muted">{tx.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassPanel>
        </div>

        <div className="col-5">
          <GlassPanel>
            <h4 style={{marginTop:0,marginBottom:16}}>Account Overview</h4>
            <div style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
              <div className="small-muted">Total Assets</div>
              <div style={{fontSize:'1.4rem',fontWeight:700,color:'var(--accent)'}}>4 tokens</div>
            </div>
            <div style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
              <div className="small-muted">Active Loans</div>
              <div style={{fontSize:'1.4rem',fontWeight:700}}>1</div>
            </div>
            <div style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
              <div className="small-muted">Outstanding Balance</div>
              <div style={{fontSize:'1.4rem',fontWeight:700}}>$3,500</div>
            </div>
            <div style={{padding:'12px 0'}}>
              <div className="small-muted">KYC Status</div>
              <div style={{display:'inline-block',padding:'4px 10px',borderRadius:6,background:'rgba(199,255,58,0.1)',color:'var(--accent)',fontSize:'0.9rem',fontWeight:600,marginTop:4}}>
                ✓ Verified
              </div>
            </div>
          </GlassPanel>

          <div style={{height:16}} />

          <GlassPanel>
            <h4 style={{marginTop:0,marginBottom:12}}>Loan Details</h4>
            <div className="small-muted" style={{marginBottom:8}}>Loan ID: #L001</div>
            <div style={{marginBottom:8}}>
              <div className="small-muted" style={{fontSize:'0.8rem'}}>Principal</div>
              <div style={{fontWeight:600}}>120 FNA</div>
            </div>
            <div style={{marginBottom:8}}>
              <div className="small-muted" style={{fontSize:'0.8rem'}}>Interest Rate</div>
              <div style={{fontWeight:600}}>5.2% APR</div>
            </div>
            <div style={{marginBottom:8}}>
              <div className="small-muted" style={{fontSize:'0.8rem'}}>Collateral</div>
              <div style={{fontWeight:600,color:'var(--accent)'}}>210 FNA (175%)</div>
            </div>
            <button className="btn" style={{marginTop:10,fontSize:'0.9rem',width:'100%'}}>Repay Loan</button>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
