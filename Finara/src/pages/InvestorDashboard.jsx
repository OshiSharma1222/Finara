import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GlassPanel from '../components/GlassPanel';
import Card from '../components/Card';
import '../styles/theme.css';

const marketData = [
  { time: '09:00', price: 102 },
  { time: '10:00', price: 105 },
  { time: '11:00', price: 103 },
  { time: '12:00', price: 108 },
  { time: '13:00', price: 112 },
  { time: '14:00', price: 110 },
  { time: '15:00', price: 115 },
];

const portfolioAllocation = [
  { name: 'Gold Tokens', value: 45, color: '#c7ff3a' },
  { name: 'Real Estate', value: 30, color: '#9be12b' },
  { name: 'Stock Tokens', value: 25, color: '#6ea81f' },
];

const activeOrders = [
  { type: 'Buy', asset: 'Gold Token', amount: '25 FNA', price: '$102', status: 'Pending' },
  { type: 'Sell', asset: 'Real Estate', amount: '10 FNA', price: '$320', status: 'Filled' },
  { type: 'Buy', asset: 'Stock Token', amount: '50 FNA', price: '$85', status: 'Pending' },
];

export default function InvestorDashboard(){
  return (
    <div style={{padding:'24px 48px',maxWidth:'1400px',margin:'0 auto'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:'0 0 6px'}}>Investor Dashboard</h2>
        <div className="small-muted">Trade tokenized assets, track your portfolio, and analyze market trends</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:16}}>
        <Card title="Portfolio Value" subtitle="Total holdings">
          <div style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)',marginTop:8}}>$58,430</div>
          <div className="small-muted">+12.4% YTD</div>
        </Card>
        <Card title="Unrealized P/L" subtitle="Gains/losses">
          <div style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)',marginTop:8}}>+$3,120</div>
          <div className="small-muted">+5.6%</div>
        </Card>
        <Card title="Realized P/L" subtitle="Settled trades">
          <div style={{fontSize:'1.8rem',fontWeight:700,marginTop:8}}>+$1,200</div>
          <div className="small-muted">From 8 trades</div>
        </Card>
        <Card title="Avg Yield" subtitle="Annual return">
          <div style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)',marginTop:8}}>4.2%</div>
          <div className="small-muted">Across all assets</div>
        </Card>
      </div>

      <div className="grid">
        <div className="col-7">
          <GlassPanel>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div>
                <h3 style={{margin:'0 0 4px'}}>Live Market</h3>
                <div className="small-muted">Real-time price action — Gold Token (FNA)</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" style={{fontSize:'0.85rem'}}>1H</button>
                <button className="btn primary" style={{fontSize:'0.85rem'}}>1D</button>
                <button className="btn" style={{fontSize:'0.85rem'}}>1W</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={marketData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="var(--muted)" style={{fontSize:12}} />
                <YAxis stroke="var(--muted)" style={{fontSize:12}} domain={[100, 120]} />
                <Tooltip 
                  contentStyle={{background:'rgba(11,15,18,0.95)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff'}}
                />
                <Area type="monotone" dataKey="price" stroke="var(--accent)" fillOpacity={1} fill="url(#priceGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassPanel>

          <div style={{height:16}} />

          <GlassPanel>
            <h4 style={{marginTop:0,marginBottom:16}}>Marketplace</h4>
            <div className="small-muted" style={{marginBottom:16}}>Featured tokenized assets — Buy/Sell with one click</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {portfolioAllocation.map((asset, i) => (
                <div key={i} style={{padding:16,borderRadius:10,background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',border:'1px solid rgba(255,255,255,0.03)'}}>
                  <div style={{fontWeight:600,marginBottom:4}}>{asset.name}</div>
                  <div className="small-muted" style={{marginBottom:8}}>Yield: 3.2%</div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn primary" style={{fontSize:'0.85rem',flex:1}}>Buy</button>
                    <button className="btn" style={{fontSize:'0.85rem',flex:1}}>Sell</button>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="col-5">
          <GlassPanel>
            <h4 style={{marginTop:0,marginBottom:16}}>Portfolio Allocation</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{background:'rgba(11,15,18,0.95)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{marginTop:12}}>
              {portfolioAllocation.map((asset, i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom: i < portfolioAllocation.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:12,height:12,borderRadius:3,background:asset.color}}></div>
                    <div className="small-muted">{asset.name}</div>
                  </div>
                  <div style={{fontWeight:600}}>{asset.value}%</div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <div style={{height:16}} />

          <GlassPanel>
            <h4 style={{marginTop:0,marginBottom:16}}>Active Orders</h4>
            <div style={{maxHeight:220,overflowY:'auto'}}>
              {activeOrders.map((order, i) => (
                <div key={i} style={{padding:'10px 0',borderBottom: i < activeOrders.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <span style={{fontWeight:600,color: order.type === 'Buy' ? 'var(--accent)' : 'var(--muted)'}}>{order.type}</span>
                    <span style={{padding:'3px 8px',borderRadius:6,background: order.status === 'Filled' ? 'rgba(155,225,43,0.1)' : 'rgba(255,255,255,0.05)',fontSize:'0.8rem'}}>{order.status}</span>
                  </div>
                  <div className="small-muted">{order.asset} • {order.amount} @ {order.price}</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
