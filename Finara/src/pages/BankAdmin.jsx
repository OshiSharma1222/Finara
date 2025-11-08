import React, {useState} from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SideNav from '../components/SideNav';
import GlassPanel from '../components/GlassPanel';
import Card from '../components/Card';
import '../styles/theme.css';

const portfolioData = [
  { month: 'Jan', value: 180, loans: 15 },
  { month: 'Feb', value: 240, loans: 18 },
  { month: 'Mar', value: 320, loans: 22 },
  { month: 'Apr', value: 410, loans: 26 },
  { month: 'May', value: 480, loans: 28 },
  { month: 'Jun', value: 560, loans: 31 },
];

const recentActivity = [
  { event: '🪙 Token minted', wallet: '0xA1b2...', amount: '50 FNA', time: '2h ago' },
  { event: '💰 Loan issued', wallet: '0xC3d4...', amount: '120 FNA', time: '6h ago' },
  { event: '✓ KYC approved', wallet: '0xE5f6...', amount: '—', time: '1d ago' },
  { event: '📊 Asset tokenized', wallet: '0xG7h8...', amount: '250 FNA', time: '2d ago' },
];

export default function BankAdmin(){
  const [section, setSection] = useState('dashboard');

  return (
    <div className="app-shell">
      <SideNav current={section} onSelect={setSection} />
      <div className="main-panel">
        {section==='dashboard' && (
          <>
            <div style={{marginBottom:20}}>
              <h2 style={{margin:'0 0 6px'}}>Bank Admin Dashboard</h2>
              <div className="small-muted">Overview of customer onboarding, asset tokenization, and loan portfolio</div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16}}>
              <Card title="Customer Onboarding" subtitle="KYC pipeline & approvals">
                <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)',marginBottom:4}}>3</div>
                <div className="small-muted">Pending KYC approvals</div>
                <button className="btn" style={{marginTop:12,fontSize:'0.9rem'}}>Review Queue →</button>
              </Card>
              <Card title="Asset Tokenization" subtitle="Create tokenized assets">
                <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)',marginBottom:4}}>12</div>
                <div className="small-muted">Assets tokenized this month</div>
                <button className="btn" style={{marginTop:12,fontSize:'0.9rem'}}>Tokenize Asset →</button>
              </Card>
              <Card title="Loan Management" subtitle="Active loans & delinquencies">
                <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)',marginBottom:4}}>24</div>
                <div className="small-muted">Active loans — Avg collateral 175%</div>
                <button className="btn" style={{marginTop:12,fontSize:'0.9rem'}}>Manage Loans →</button>
              </Card>
            </div>

            <div className="grid">
              <div className="col-8">
                <GlassPanel>
                  <h3 className="title">Portfolio Analytics</h3>
                  <div className="small-muted" style={{marginBottom:16}}>Total value locked (TVL) and loan growth over time</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={portfolioData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="var(--muted)" style={{fontSize:12}} />
                      <YAxis stroke="var(--muted)" style={{fontSize:12}} />
                      <Tooltip 
                        contentStyle={{background:'rgba(11,15,18,0.95)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff'}}
                      />
                      <Area type="monotone" dataKey="value" stroke="var(--accent)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </GlassPanel>
              </div>
              <div className="col-4">
                <GlassPanel>
                  <h4 style={{marginTop:0,marginBottom:16}}>Recent Activity</h4>
                  <div style={{maxHeight:300,overflowY:'auto'}}>
                    {recentActivity.map((act, i) => (
                      <div key={i} style={{padding:'10px 0',borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'}}>
                        <div style={{fontWeight:600,fontSize:'0.95rem',marginBottom:2}}>{act.event}</div>
                        <div className="small-muted">{act.wallet} • {act.amount}</div>
                        <div className="small-muted" style={{fontSize:'0.8rem',marginTop:2}}>{act.time}</div>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>
            </div>
          </>
        )}

        {section==='onboarding' && (
          <GlassPanel>
            <h3 style={{marginTop:0,marginBottom:16}}>Customer Onboarding</h3>
            <div className="small-muted" style={{marginBottom:20}}>List of pending KYC with approve/reject actions and audit trail.</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Account ID</th>
                  <th>Wallet</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Alice Johnson</td>
                  <td>ACC-1001</td>
                  <td className="small-muted">0xA1b2...c3D4</td>
                  <td><span style={{padding:'4px 8px',borderRadius:6,background:'rgba(199,255,58,0.1)',color:'var(--accent)',fontSize:'0.85rem'}}>Pending</span></td>
                  <td><button className="btn" style={{fontSize:'0.85rem'}}>Approve</button></td>
                </tr>
                <tr>
                  <td>Bob Smith</td>
                  <td>ACC-1002</td>
                  <td className="small-muted">0xE5f6...g7H8</td>
                  <td><span style={{padding:'4px 8px',borderRadius:6,background:'rgba(199,255,58,0.1)',color:'var(--accent)',fontSize:'0.85rem'}}>Pending</span></td>
                  <td><button className="btn" style={{fontSize:'0.85rem'}}>Approve</button></td>
                </tr>
              </tbody>
            </table>
          </GlassPanel>
        )}

        {section==='tokenization' && (
          <GlassPanel>
            <h3 style={{marginTop:0,marginBottom:16}}>Asset Tokenization</h3>
            <div className="small-muted" style={{marginBottom:20}}>Create and manage tokenized assets, set caps, and mint tokens.</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              <div>
                <label style={{display:'block',marginBottom:6,fontWeight:600}}>Asset Type</label>
                <select className="btn" style={{width:'100%',textAlign:'left'}}>
                  <option>Gold</option>
                  <option>Real Estate</option>
                  <option>Stocks</option>
                </select>
              </div>
              <div>
                <label style={{display:'block',marginBottom:6,fontWeight:600}}>Token Amount</label>
                <input type="number" placeholder="Enter amount" className="btn" style={{width:'100%'}} />
              </div>
            </div>
            <button className="btn primary">Tokenize Asset</button>
          </GlassPanel>
        )}

        {section==='loans' && (
          <GlassPanel>
            <h3 style={{marginTop:0,marginBottom:16}}>Loan Management</h3>
            <div className="small-muted" style={{marginBottom:20}}>Create loans, view collateral, initiate liquidations.</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Borrower</th>
                  <th>Amount</th>
                  <th>Collateral</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#L001</td>
                  <td className="small-muted">0xA1b2...c3D4</td>
                  <td>120 FNA</td>
                  <td style={{color:'var(--accent)'}}>210 FNA (175%)</td>
                  <td><span style={{padding:'4px 8px',borderRadius:6,background:'rgba(155,225,43,0.1)',color:'var(--accent-2)',fontSize:'0.85rem'}}>Active</span></td>
                </tr>
                <tr>
                  <td>#L002</td>
                  <td className="small-muted">0xE5f6...g7H8</td>
                  <td>85 FNA</td>
                  <td style={{color:'var(--accent)'}}>140 FNA (165%)</td>
                  <td><span style={{padding:'4px 8px',borderRadius:6,background:'rgba(155,225,43,0.1)',color:'var(--accent-2)',fontSize:'0.85rem'}}>Active</span></td>
                </tr>
              </tbody>
            </table>
          </GlassPanel>
        )}

        {section==='analytics' && (
          <GlassPanel>
            <h3 style={{marginTop:0,marginBottom:16}}>Portfolio Analytics</h3>
            <div className="small-muted" style={{marginBottom:20}}>Time series, allocation, risk metrics and scenario simulator.</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--muted)" style={{fontSize:12}} />
                <YAxis stroke="var(--muted)" style={{fontSize:12}} />
                <Tooltip 
                  contentStyle={{background:'rgba(11,15,18,0.95)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff'}}
                />
                <Bar dataKey="loans" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
