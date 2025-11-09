import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GlassPanel from '../components/GlassPanel';
import Card from '../components/Card';
import Footer from '../components/Footer';
import '../styles/theme.css';
import trading from '../services/trading';
import blockchain from '../services/blockchain';

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
  { type: 'Buy', asset: 'Gold Token', amount: '25 GOLD', price: '₹102', status: 'Pending' },
  { type: 'Sell', asset: 'Real Estate', amount: '10 RE', price: '₹320', status: 'Filled' },
  { type: 'Buy', asset: 'Stock Token', amount: '50 STK', price: '₹85', status: 'Pending' },
];

const availableAssets = [
  { id: 1, type: 'Gold', owner: 'Rajesh Kumar', quantity: '520 GOLD', price: '₹5,20,000', yield: '3.2%' },
  { id: 2, type: 'Mutual Funds', owner: 'Priya Sharma', quantity: '280 MF', price: '₹2,80,000', yield: '4.1%' },
  { id: 3, type: 'Real Estate', owner: 'Amit Patel', quantity: '125 RE', price: '₹6,25,000', yield: '5.5%' },
];

export default function InvestorDashboard(){
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('portfolio');
  const [investorId, setInvestorId] = useState(null);
  const [marketplace, setMarketplace] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [blockchainTxns, setBlockchainTxns] = useState([]);
  const [showTxModal, setShowTxModal] = useState(false);
  const [currentTx, setCurrentTx] = useState(null);
  const [investorWallet, setInvestorWallet] = useState(null);

  useEffect(() => {
    if(investorId){
      const mp = trading.getMarketplace();
      setMarketplace(mp && mp.length ? mp : availableAssets);
      setTradeHistory(trading.getHistoryForAccount(investorId));
      if(investorWallet) {
        setBlockchainTxns(blockchain.getAccountTransactions(investorWallet));
      }
    }
  }, [investorId, investorWallet]);

  const handleBuy = (asset) => {
    try{
      // If asset comes from our trading marketplace it may have listingId
      const isListing = asset.listingId || asset.listingId === 0;
      let listingId = asset.listingId;
      if(!isListing){
        // create listing from the availableAssets seed
        const priceNum = Number(String(asset.price).replace(/[^0-9.-]+/g, '')) || 0;
        const created = trading.listAsset({
          sellerId: asset.owner || 'unknown-seller',
          assetId: asset.id || (String(Date.now()) + '-' + Math.random().toString(36).slice(2,8)),
          assetType: asset.assetType || asset.type,
          quantity: asset.quantity,
          tokens: asset.quantity,
          price: priceNum,
          percentage: 100
        });
        listingId = created.listingId;
      }
      const trade = trading.buyAsset({ buyerId: investorId || 'demo-investor', listingId });

      // Record on blockchain
      const blockchainTx = blockchain.recordTransaction({
        type: 'ASSET_PURCHASE',
        from: investorWallet || ('0xInvestor' + investorId),
        to: asset.owner || 'Seller',
        assetType: asset.assetType || asset.type,
        assetId: asset.id,
        amount: trade.price,
        tokens: trade.tokens,
        metadata: {
          tradeId: trade.tradeId,
          listingId
        }
      });

      // refresh marketplace and history
      setMarketplace(trading.getMarketplace());
      setTradeHistory(trading.getHistoryForAccount(investorId));
      if(investorWallet) {
        setBlockchainTxns(blockchain.getAccountTransactions(investorWallet));
      }

      // Show transaction details
      setCurrentTx(blockchainTx);
      setShowTxModal(true);
    }catch(e){
      console.error('buy failed', e);
      alert('Purchase failed. See console for details.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo login - accept any email with password "demo123"
    if (loginForm.password === 'demo123') {
      setInvestorId(loginForm.email || 'demo-investor');
      // Generate a mock wallet address for the investor
      const wallet = '0x' + loginForm.email.replace(/@/g,'').replace(/\./g,'').slice(0,8).padEnd(40, '0');
      setInvestorWallet(wallet);
      setIsLoggedIn(true);
    } else {
      alert('Demo credentials: Any email with password "demo123"');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column'}}>
        <NavBar />
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
          <div style={{width:'100%',maxWidth:'520px'}}>
            <GlassPanel style={{padding:'56px 48px',position:'relative',overflow:'hidden'}}>
              {/* Decorative Elements */}
              <div style={{
                position:'absolute',
                top:'-60px',
                right:'-60px',
                width:'220px',
                height:'220px',
                background:'radial-gradient(circle, rgba(199,255,58,0.1) 0%, transparent 70%)',
                borderRadius:'50%',
                pointerEvents:'none'
              }}></div>
              <div style={{
                position:'absolute',
                bottom:'-40px',
                left:'-40px',
                width:'170px',
                height:'170px',
                background:'radial-gradient(circle, rgba(155,225,43,0.08) 0%, transparent 70%)',
                borderRadius:'50%',
                pointerEvents:'none'
              }}></div>

              <div style={{textAlign:'center',marginBottom:40,position:'relative'}}>
                <div style={{
                  fontSize:'4rem',
                  marginBottom:20,
                  filter:'drop-shadow(0 4px 12px rgba(199,255,58,0.2))'
                }}>💼</div>
                <h2 style={{fontSize:'2.2rem',fontWeight:700,marginBottom:12,color:'#fff',letterSpacing:'-0.02em'}}>
                  Investor Portal
                </h2>
                <p className="small-muted" style={{fontSize:'1.05rem',lineHeight:1.6}}>
                  Access marketplace and manage your investment portfolio
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{marginBottom:24}}>
                  <label style={{display:'block',marginBottom:10,fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="investor@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                    style={{
                      width:'100%',
                      padding:'16px 18px',
                      fontSize:'1rem',
                      background:'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(255,255,255,0.12)',
                      borderRadius:12,
                      color:'#fff',
                      transition:'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>

                <div style={{marginBottom:32}}>
                  <label style={{display:'block',marginBottom:10,fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                    style={{
                      width:'100%',
                      padding:'16px 18px',
                      fontSize:'1rem',
                      background:'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(255,255,255,0.12)',
                      borderRadius:12,
                      color:'#fff',
                      transition:'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                  <div style={{marginTop:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <label style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.9rem',color:'rgba(255,255,255,0.7)',cursor:'pointer'}}>
                      <input type="checkbox" style={{width:16,height:16,cursor:'pointer'}} />
                      Remember me
                    </label>
                    <a href="#" style={{fontSize:'0.9rem',color:'var(--accent)',textDecoration:'none'}}>
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn primary" 
                  style={{
                    width:'100%',
                    padding:'16px',
                    fontSize:'1.05rem',
                    fontWeight:600,
                    marginBottom:24,
                    background:'linear-gradient(135deg, var(--accent) 0%, #9be12b 100%)',
                    border:'none',
                    boxShadow:'0 4px 16px rgba(199,255,58,0.25)',
                    transition:'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 24px rgba(199,255,58,0.35)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 16px rgba(199,255,58,0.25)';
                  }}
                >
                  Login to Dashboard
                </button>

                <div style={{
                  padding:'16px',
                  background:'rgba(199,255,58,0.05)',
                  border:'1px solid rgba(199,255,58,0.15)',
                  borderRadius:12,
                  marginBottom:20
                }}>
                  <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)',marginBottom:6}}>
                    🔐 <strong style={{color:'#fff'}}>Demo Access</strong>
                  </div>
                  <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.6)'}}>
                    Email: <span style={{color:'var(--accent)',fontWeight:600,fontFamily:'monospace'}}>any email</span>
                    {' • '}
                    Password: <span style={{color:'var(--accent)',fontWeight:600,fontFamily:'monospace'}}>demo123</span>
                  </div>
                </div>

                <div style={{textAlign:'center',fontSize:'0.9rem',color:'var(--muted)'}}>
                  New investor? <a href="#" style={{color:'var(--accent)',textDecoration:'none',fontWeight:600}}>Register Account</a>
                </div>
              </form>
            </GlassPanel>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',background:'#000',paddingTop:'90px',display:'flex',flexDirection:'column'}}>
      <NavBar />
      <div style={{flex:1,padding:'40px 48px',maxWidth:'1400px',width:'100%',margin:'0 auto'}}>
        {/* Header */}
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:'2.5rem',fontWeight:700,marginBottom:8,color:'#fff'}}>
            Investor Dashboard
          </h1>
          <p className="small-muted" style={{fontSize:'1.05rem'}}>
            Trade tokenized assets, track your portfolio, and analyze market trends
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:12,marginBottom:32,borderBottom:'1px solid rgba(255,255,255,0.1)',paddingBottom:12}}>
          {['portfolio', 'marketplace', 'orders', 'blockchain', 'analytics'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'btn primary' : 'btn'}
              onClick={() => setActiveTab(tab)}
              style={{padding:'10px 24px',fontSize:'1rem',textTransform:'capitalize'}}
            >
              {tab === 'blockchain' ? '⛓️ Blockchain' : tab}
            </button>
          ))}
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,marginBottom:32}}>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>💰</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>Portfolio Value</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)'}}>₹58.4L</div>
                <div style={{fontSize:'0.85rem',color:'#82ca9d',marginTop:4}}>+12.4% YTD</div>
              </Card>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>📈</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>Unrealized P/L</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)'}}>+₹3.1L</div>
                <div style={{fontSize:'0.85rem',color:'#82ca9d',marginTop:4}}>+5.6%</div>
              </Card>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>💵</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>Realized P/L</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'#fff'}}>+₹1.2L</div>
                <div style={{fontSize:'0.85rem',color:'var(--muted)',marginTop:4}}>From 8 trades</div>
              </Card>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>📊</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>Avg Yield</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)'}}>4.2%</div>
                <div style={{fontSize:'0.85rem',color:'var(--muted)',marginTop:4}}>Annual return</div>
              </Card>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:24}}>
              <GlassPanel style={{padding:28}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                  <div>
                    <h3 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:4,color:'#fff'}}>Live Market</h3>
                    <div className="small-muted">Real-time price action — Gold Token (GOLD)</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn" style={{fontSize:'0.85rem',padding:'6px 12px'}}>1H</button>
                    <button className="btn primary" style={{fontSize:'0.85rem',padding:'6px 12px'}}>1D</button>
                    <button className="btn" style={{fontSize:'0.85rem',padding:'6px 12px'}}>1W</button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
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
                      contentStyle={{background:'rgba(11,15,18,0.95)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff'}}
                    />
                    <Area type="monotone" dataKey="price" stroke="var(--accent)" fillOpacity={1} fill="url(#priceGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassPanel>

              <div style={{display:'flex',flexDirection:'column',gap:24}}>
                <GlassPanel style={{padding:28}}>
                  <h4 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:16,color:'#fff'}}>Portfolio Allocation</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={portfolioAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
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
                          <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)'}}>{asset.name}</div>
                        </div>
                        <div style={{fontWeight:600,fontSize:'0.95rem',color:'#fff'}}>{asset.value}%</div>
                      </div>
                    ))}
                  </div>
                </GlassPanel>

                <GlassPanel style={{padding:28}}>
                  <h4 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:16,color:'#fff'}}>Quick Actions</h4>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    <button className="btn primary" style={{width:'100%',padding:'12px',fontSize:'0.95rem'}} onClick={() => setActiveTab('marketplace')}>
                      🏪 Browse Marketplace
                    </button>
                    <button className="btn" style={{width:'100%',padding:'12px',fontSize:'0.95rem'}} onClick={() => setActiveTab('orders')}>
                      📋 View Orders
                    </button>
                    <button className="btn" style={{width:'100%',padding:'12px',fontSize:'0.95rem',marginTop:8}} onClick={() => setIsLoggedIn(false)}>
                      🚪 Logout
                    </button>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div>
            <div style={{marginBottom:24}}>
              <h3 style={{fontSize:'1.6rem',fontWeight:700,color:'#fff',marginBottom:8}}>Available Assets</h3>
              <p className="small-muted">Buy tokenized assets from verified sellers</p>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              {marketplace.map((asset) => (
                <GlassPanel key={asset.listingId || asset.id} style={{padding:28}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                    <div style={{flex:1}}>
                      <h4 style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:8}}>{asset.assetType || asset.type}</h4>
                      <div style={{display:'flex',gap:16,marginBottom:16}}>
                        <div>
                          <div className="small-muted" style={{marginBottom:4}}>Seller</div>
                          <div style={{fontSize:'0.95rem',fontWeight:600,color:'#fff'}}>{asset.owner || asset.sellerId}</div>
                        </div>
                        <div>
                          <div className="small-muted" style={{marginBottom:4}}>Quantity</div>
                          <div style={{fontSize:'0.95rem',fontWeight:600,color:'#fff'}}>{asset.quantity}</div>
                        </div>
                        <div>
                          <div className="small-muted" style={{marginBottom:4}}>Expected Yield</div>
                          <div style={{fontSize:'0.95rem',fontWeight:600,color:'var(--accent)'}}>{asset.yield || '—'}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)',marginBottom:12}}>{typeof asset.price === 'number' ? `₹${asset.price.toLocaleString()}` : (asset.price || '—')}</div>
                      <div style={{display:'flex',gap:12}}>
                        <button className="btn primary" style={{padding:'12px 24px',fontSize:'1rem'}} onClick={() => handleBuy(asset)}>
                          💰 Buy Now
                        </button>
                        <button className="btn" style={{padding:'12px 24px',fontSize:'1rem'}}>
                          📊 Details
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <GlassPanel style={{padding:32}}>
            <h3 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:24,color:'#fff'}}>Active Orders</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {tradeHistory && tradeHistory.length > 0 ? tradeHistory.map((t, i) => (
                <div key={t.tradeId || i} style={{
                  padding:20,
                  background:'rgba(255,255,255,0.02)',
                  borderRadius:12,
                  border:'1px solid rgba(255,255,255,0.06)',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center'
                }}>
                  <div>
                    <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>
                      <span style={{
                        fontWeight:700,
                        fontSize:'1.1rem',
                        color: t.buyerId === investorId ? 'var(--accent)' : '#ff8a65'
                      }}>{t.buyerId === investorId ? 'Buy' : 'Sell'}</span>
                      <span style={{
                        padding:'4px 12px',
                        borderRadius:6,
                        background: 'rgba(130,202,157,0.1)',
                        color: '#82ca9d',
                        fontSize:'0.85rem',
                        fontWeight:600
                      }}>{new Date(t.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{fontSize:'0.95rem',color:'var(--muted)'}}>
                      {t.assetType} • {t.quantity} @ ₹{t.price}
                    </div>
                  </div>
                  <button className="btn" style={{padding:'10px 20px',fontSize:'0.9rem'}}>
                    View
                  </button>
                </div>
              )) : (
                <div style={{padding:20,color:'var(--muted)'}}>No trades yet — your executed trades will appear here.</div>
              )}
            </div>
          </GlassPanel>
        )}

        {/* Blockchain Tab */}
        {activeTab === 'blockchain' && (
          <div>
            <div style={{marginBottom:24}}>
              <h3 style={{fontSize:'1.6rem',fontWeight:700,color:'#fff',marginBottom:8}}>Blockchain Transactions</h3>
              <p className="small-muted">All your investment transactions recorded on the blockchain</p>
            </div>

            {blockchainTxns && blockchainTxns.length > 0 ? (
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                {blockchainTxns.map((tx) => (
                  <GlassPanel key={tx.txHash} style={{padding:24}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>
                          <span style={{fontSize:'1.5rem'}}>
                            {tx.type === 'ASSET_PURCHASE' ? '🛒' : tx.type === 'ASSET_SALE' ? '💰' : '🔄'}
                          </span>
                          <span style={{fontSize:'1.1rem',fontWeight:700,color:'#fff'}}>
                            {tx.type.replace(/_/g, ' ')}
                          </span>
                          <span style={{
                            padding:'4px 12px',
                            borderRadius:6,
                            background: 'rgba(130,202,157,0.1)',
                            color: '#82ca9d',
                            fontSize:'0.85rem',
                            fontWeight:600
                          }}>{tx.status}</span>
                        </div>
                        <div style={{fontSize:'0.95rem',color:'var(--muted)',marginBottom:12}}>
                          {tx.assetType} • {tx.tokens} tokens • {new Date(tx.timestamp).toLocaleString()}
                        </div>
                        <div style={{
                          padding:'12px',
                          background:'rgba(0,0,0,0.2)',
                          borderRadius:8,
                          fontFamily:'monospace',
                          fontSize:'0.85rem',
                          color:'var(--accent)',
                          wordBreak:'break-all'
                        }}>
                          <strong>Tx Hash:</strong> {tx.txHash}
                        </div>
                      </div>
                      <div style={{textAlign:'right',marginLeft:24}}>
                        <div style={{fontSize:'1.5rem',fontWeight:700,color:'var(--accent)',marginBottom:8}}>
                          ₹{tx.amount?.toLocaleString()}
                        </div>
                        <div style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:8}}>
                          Block: {tx.blockNumber}
                        </div>
                        <div style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:12}}>
                          Confirmations: {tx.confirmations}
                        </div>
                        <button 
                          className="btn"
                          onClick={() => {
                            setCurrentTx(tx);
                            setShowTxModal(true);
                          }}
                          style={{padding:'8px 16px',fontSize:'0.9rem'}}
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    <div style={{
                      display:'grid',
                      gridTemplateColumns:'repeat(2,1fr)',
                      gap:16,
                      marginTop:16,
                      paddingTop:16,
                      borderTop:'1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div>
                        <div style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:4}}>From</div>
                        <div style={{fontSize:'0.9rem',color:'#fff',fontFamily:'monospace'}}>
                          {tx.from.slice(0,6)}...{tx.from.slice(-4)}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:4}}>To</div>
                        <div style={{fontSize:'0.9rem',color:'#fff',fontFamily:'monospace'}}>
                          {tx.to.slice(0,6)}...{tx.to.slice(-4)}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:4}}>Gas Used</div>
                        <div style={{fontSize:'0.9rem',color:'#fff'}}>{tx.gasUsed?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:4}}>Gas Fee</div>
                        <div style={{fontSize:'0.9rem',color:'#fff'}}>{tx.gasFee}</div>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            ) : (
              <GlassPanel style={{padding:40}}>
                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--muted)'}}>
                  <div style={{fontSize:'4rem',marginBottom:16}}>⛓️</div>
                  <div style={{fontSize:'1.2rem',marginBottom:12}}>No Blockchain Transactions Yet</div>
                  <div>Your blockchain transactions will appear here once you purchase assets</div>
                </div>
              </GlassPanel>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <GlassPanel style={{padding:32}}>
            <h3 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:24,color:'#fff'}}>Portfolio Analytics</h3>
            <div style={{textAlign:'center',padding:'80px 20px',color:'var(--muted)'}}>
              <div style={{fontSize:'4rem',marginBottom:16}}>📊</div>
              <div style={{fontSize:'1.2rem',marginBottom:12}}>Advanced Analytics Coming Soon</div>
              <div>Track performance, risk metrics, and generate reports</div>
            </div>
          </GlassPanel>
        )}
      </div>

      {/* Blockchain Transaction Modal */}
      {showTxModal && currentTx && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:'rgba(0,0,0,0.9)',
          backdropFilter:'blur(12px)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:10000,
          padding:20
        }} onClick={() => setShowTxModal(false)}>
          <GlassPanel style={{padding:40,maxWidth:650,width:'100%'}} onClick={(e) => e.stopPropagation()}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{fontSize:'4rem',marginBottom:16}}>⛓️</div>
              <h3 style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)',marginBottom:8}}>
                Transaction Recorded on Blockchain
              </h3>
              <p style={{color:'var(--muted)',fontSize:'1.05rem'}}>
                Your transaction has been successfully recorded on the blockchain
              </p>
            </div>

            <div style={{
              background:'rgba(199,255,58,0.05)',
              border:'1px solid rgba(199,255,58,0.2)',
              borderRadius:12,
              padding:20,
              marginBottom:24
            }}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Transaction Hash</span>
                <span style={{color:'var(--accent)',fontFamily:'monospace',fontSize:'0.9rem',fontWeight:600}}>
                  {currentTx.txHash.slice(0,10)}...{currentTx.txHash.slice(-8)}
                </span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Block Number</span>
                <span style={{color:'#fff',fontWeight:600}}>{currentTx.blockNumber}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Transaction Type</span>
                <span style={{color:'#fff',fontWeight:600}}>{currentTx.type.replace(/_/g, ' ')}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Asset</span>
                <span style={{color:'#fff',fontWeight:600}}>{currentTx.assetType}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Tokens</span>
                <span style={{color:'#fff',fontWeight:600}}>{currentTx.tokens}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Amount</span>
                <span style={{color:'var(--accent)',fontWeight:600}}>₹{currentTx.amount?.toLocaleString()}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Gas Fee</span>
                <span style={{color:'#fff',fontWeight:600}}>{currentTx.gasFee}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{color:'var(--muted)'}}>Confirmations</span>
                <span style={{color:'#82ca9d',fontWeight:600}}>✓ {currentTx.confirmations}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--muted)'}}>Status</span>
                <span style={{
                  padding:'4px 12px',
                  borderRadius:6,
                  background:'rgba(130,202,157,0.15)',
                  color:'#82ca9d',
                  fontSize:'0.85rem',
                  fontWeight:600,
                  textTransform:'uppercase'
                }}>{currentTx.status}</span>
              </div>
            </div>

            <div style={{display:'flex',gap:12}}>
              <button 
                className="btn" 
                onClick={() => {
                  navigator.clipboard.writeText(currentTx.txHash);
                  alert('Transaction hash copied to clipboard!');
                }}
                style={{flex:1,padding:'14px',fontSize:'1rem'}}
              >
                📋 Copy Hash
              </button>
              <button 
                className="btn" 
                onClick={() => window.open(blockchain.getExplorerUrl(currentTx.txHash), '_blank')}
                style={{flex:1,padding:'14px',fontSize:'1rem'}}
              >
                🔍 View on Explorer
              </button>
              <button 
                className="btn primary" 
                onClick={() => setShowTxModal(false)}
                style={{padding:'14px 24px',fontSize:'1rem'}}
              >
                Close
              </button>
            </div>
          </GlassPanel>
        </div>
      )}

      <Footer />
    </div>
  );
}
