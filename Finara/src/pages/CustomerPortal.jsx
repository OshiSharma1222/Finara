import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import GlassPanel from '../components/GlassPanel';
import Card from '../components/Card';
import Footer from '../components/Footer';
import '../styles/theme.css';
import trading from '../services/trading';
import blockchain from '../services/blockchain';

// Mock customer data (in real app, this would come from authentication)
const mockCustomerData = {
  id: 'CUST-2024-001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@email.com',
  mobile: '+91 98765 43210',
  accountNumber: '1234567890',
  kycStatus: 'Approved',
  panNumber: 'ABCDE1234F',
  aadhaarNumber: '****-****-5678',
  address: '123 MG Road, Bangalore, Karnataka 560001',
  joinedDate: '15 Jan 2024',
  wallet: '0xA1b2C3d4E5f6G7h8I9j0',
};

const mockAssets = [
  {
    id: 'ASSET-001',
    type: 'Gold',
    quantity: '520g',
    value: '₹5,20,000',
    tokenized: true,
    tokens: 520,
    tokenSymbol: 'GOLD',
    purchaseDate: '10 Feb 2024',
    verificationDoc: 'Gold-Certificate.pdf',
    status: 'Active',
    listingStatus: 'Not Listed',
    matches: []
  },
  {
    id: 'ASSET-002',
    type: 'Mutual Funds',
    quantity: '280 Units',
    value: '₹2,80,000',
    tokenized: true,
    tokens: 280,
    tokenSymbol: 'MF',
    purchaseDate: '25 Mar 2024',
    verificationDoc: 'MF-Statement.pdf',
    status: 'Active',
    listingStatus: 'Listed',
    matches: [
      { buyer: 'Amit Patel', interest: 'Full Asset', offer: '₹2,85,000', status: 'Pending' },
      { buyer: 'Priya Sharma', interest: '50%', offer: '₹1,42,000', status: 'Pending' }
    ]
  },
  {
    id: 'ASSET-003',
    type: 'Real Estate',
    quantity: '250 sq ft',
    value: '₹12,50,000',
    tokenized: false,
    tokens: 0,
    tokenSymbol: 'RE',
    purchaseDate: '05 Jan 2024',
    verificationDoc: 'Property-Deed.pdf',
    status: 'Pending Verification',
    listingStatus: 'Not Listed',
    matches: []
  }
];

const mockLoans = [
  {
    id: 'LOAN-001',
    amount: '₹4,00,000',
    collateral: '520 GOLD',
    ltv: '77%',
    interestRate: '8.5%',
    tenure: '24 months',
    emi: '₹18,200',
    status: 'Active',
    disbursedDate: '15 Mar 2024',
    nextEmiDate: '15 Dec 2024',
    remainingEmis: 21
  }
];

export default function CustomerPortal(){
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ accountNumber: '', password: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [sellModal, setSellModal] = useState(false);
  const [sellForm, setSellForm] = useState({ price: '', percentage: '100' });
  const [assets, setAssets] = useState(mockAssets);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [blockchainTxns, setBlockchainTxns] = useState([]);
  const [showTxModal, setShowTxModal] = useState(false);
  const [currentTx, setCurrentTx] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo login - accept any account number with password "demo123"
    if (loginForm.password === 'demo123') {
      setIsLoggedIn(true);
    } else {
      alert('Demo credentials: Any account number with password "demo123"');
    }
  };

  const acceptOffer = (match, asset) => {
    // If asset already has a listingId, use it; otherwise create a temporary listing then buy
    try{
      let listingId = asset.listingId;
      if(!listingId){
        // parse numeric price
        const offerNum = Number(String(match.offer).replace(/[^0-9.-]+/g, '')) || 0;
        const created = trading.listAsset({
          sellerId: mockCustomerData.accountNumber || mockCustomerData.id,
          assetId: asset.id,
          assetType: asset.type,
          quantity: asset.quantity,
          tokens: asset.tokens,
          price: offerNum,
          percentage: match.interest && match.interest.toLowerCase().includes('full') ? 100 : 50
        });
        listingId = created.listingId;
        setAssets(prev => prev.map(a => a.id === asset.id ? {...a, listingStatus: 'Listed', listingId } : a));
      }

      // perform buy (the match.buyer is a name in mock; we'll use it as buyerId for demo)
      const trade = trading.buyAsset({ buyerId: match.buyer, listingId });

      // Record on blockchain
      const blockchainTx = blockchain.recordTransaction({
        type: 'ASSET_SALE',
        from: mockCustomerData.wallet,
        to: '0xBuyerAddress' + match.buyer.replace(/\s/g, ''),
        assetType: asset.type,
        assetId: asset.id,
        amount: trade.price,
        tokens: asset.tokens,
        metadata: {
          tradeId: trade.tradeId,
          buyer: match.buyer
        }
      });

      // update asset state to reflect sale
      setAssets(prev => prev.map(a => a.id === asset.id ? {...a, listingStatus: 'Sold'} : a));
      setTradeHistory(trading.getHistoryForAccount(mockCustomerData.accountNumber || mockCustomerData.id));
      setBlockchainTxns(blockchain.getAccountTransactions(mockCustomerData.wallet));

      // Show transaction details
      setCurrentTx(blockchainTx);
      setShowTxModal(true);
    }catch(e){
      console.error('accept offer failed', e);
      alert('Failed to accept offer. See console for details.');
    }
  };

  useEffect(() => {
    if(isLoggedIn){
      const acct = mockCustomerData.accountNumber || mockCustomerData.id;
      setTradeHistory(trading.getHistoryForAccount(acct));
      setBlockchainTxns(blockchain.getAccountTransactions(mockCustomerData.wallet));
    }
  }, [isLoggedIn]);

  const handleSellAsset = (asset) => {
    setSelectedAsset(asset);
    setSellForm({ price: asset.value.replace('₹', '').replace(',', ''), percentage: '100' });
    setSellModal(true);
  };

  const submitSellListing = () => {
    // create a persistent listing and update local state
    try{
      const priceNum = Number(String(sellForm.price).replace(/[^0-9.-]+/g, '')) || 0;
      const listing = trading.listAsset({
        sellerId: mockCustomerData.accountNumber || mockCustomerData.id,
        assetId: selectedAsset.id,
        assetType: selectedAsset.type,
        quantity: selectedAsset.quantity,
        tokens: selectedAsset.tokens,
        price: priceNum,
        percentage: sellForm.percentage
      });

      // Record on blockchain
      const blockchainTx = blockchain.recordTransaction({
        type: 'ASSET_LISTING',
        from: mockCustomerData.wallet,
        to: '0x0000000000000000000000000000000000000000', // Null address for listing
        assetType: selectedAsset.type,
        assetId: selectedAsset.id,
        amount: priceNum,
        tokens: selectedAsset.tokens,
        metadata: {
          listingId: listing.listingId,
          percentage: sellForm.percentage
        }
      });

      setAssets(prev => prev.map(a => a.id === selectedAsset.id ? {...a, listingStatus: 'Listed', listingId: listing.listingId } : a));
      setTradeHistory(trading.getHistoryForAccount(mockCustomerData.accountNumber || mockCustomerData.id));
      setBlockchainTxns(blockchain.getAccountTransactions(mockCustomerData.wallet));
      
      // Show transaction details
      setCurrentTx(blockchainTx);
      setShowTxModal(true);
      setSellModal(false);
    }catch(e){
      console.error('listing failed', e);
      alert('Failed to list asset. See console for details.');
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
                top:'-50px',
                right:'-50px',
                width:'200px',
                height:'200px',
                background:'radial-gradient(circle, rgba(199,255,58,0.08) 0%, transparent 70%)',
                borderRadius:'50%',
                pointerEvents:'none'
              }}></div>
              <div style={{
                position:'absolute',
                bottom:'-30px',
                left:'-30px',
                width:'150px',
                height:'150px',
                background:'radial-gradient(circle, rgba(155,225,43,0.06) 0%, transparent 70%)',
                borderRadius:'50%',
                pointerEvents:'none'
              }}></div>

              <div style={{textAlign:'center',marginBottom:40,position:'relative'}}>
                <div style={{
                  fontSize:'4rem',
                  marginBottom:20,
                  filter:'drop-shadow(0 4px 12px rgba(199,255,58,0.2))'
                }}>👤</div>
                <h2 style={{fontSize:'2.2rem',fontWeight:700,marginBottom:12,color:'#fff',letterSpacing:'-0.02em'}}>
                  Customer Portal
                </h2>
                <p className="small-muted" style={{fontSize:'1.05rem',lineHeight:1.6}}>
                  Manage your assets, view KYC details, and access loans
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{marginBottom:24}}>
                  <label style={{display:'block',marginBottom:10,fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your account number"
                    value={loginForm.accountNumber}
                    onChange={(e) => setLoginForm({...loginForm, accountNumber: e.target.value})}
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
                  <div style={{marginTop:10,textAlign:'right'}}>
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
                  Login to Portal
                </button>

                <div style={{
                  padding:'16px',
                  background:'rgba(199,255,58,0.05)',
                  border:'1px solid rgba(199,255,58,0.15)',
                  borderRadius:12,
                  marginBottom:20
                }}>
                  <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)',marginBottom:6}}>
                    🔐 <strong style={{color:'#fff'}}>Demo Credentials</strong>
                  </div>
                  <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.6)'}}>
                    Account: <span style={{color:'var(--accent)',fontWeight:600,fontFamily:'monospace'}}>any number</span>
                    {' • '}
                    Password: <span style={{color:'var(--accent)',fontWeight:600,fontFamily:'monospace'}}>demo123</span>
                  </div>
                </div>

                <div style={{textAlign:'center',fontSize:'0.9rem',color:'var(--muted)'}}>
                  New customer? <a href="#" style={{color:'var(--accent)',textDecoration:'none',fontWeight:600}}>Contact Bank</a>
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
            Welcome back, {mockCustomerData.name}
          </h1>
          <p className="small-muted" style={{fontSize:'1.05rem'}}>
            Account: {mockCustomerData.accountNumber} • Joined {mockCustomerData.joinedDate}
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:12,marginBottom:32,borderBottom:'1px solid rgba(255,255,255,0.1)',paddingBottom:12}}>
          {['overview', 'assets', 'kyc', 'loans', 'blockchain', 'marketplace'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'btn primary' : 'btn'}
              onClick={() => setActiveTab(tab)}
              style={{padding:'10px 24px',fontSize:'1rem',textTransform:'capitalize'}}
            >
              {tab === 'kyc' ? 'KYC Details' : tab === 'blockchain' ? '⛓️ Blockchain' : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,marginBottom:32}}>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>💼</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>Total Assets Value</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)'}}>₹20.5L</div>
              </Card>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>🪙</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>Tokenized Assets</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'#fff'}}>800</div>
              </Card>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>💰</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>Active Loans</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'#fff'}}>1</div>
              </Card>
              <Card>
                <div style={{fontSize:'2rem',marginBottom:8}}>✅</div>
                <div className="small-muted" style={{fontSize:'0.9rem',marginBottom:8}}>KYC Status</div>
                <div style={{fontSize:'1.3rem',fontWeight:700,color:'var(--accent)'}}>Approved</div>
              </Card>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:24}}>
              <GlassPanel style={{padding:28}}>
                <h3 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:20,color:'#fff'}}>Your Assets</h3>
                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                  {assets.map((asset) => (
                    <div key={asset.id} style={{
                      padding:20,
                      background:'rgba(255,255,255,0.02)',
                      borderRadius:12,
                      border:'1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}}>
                        <div>
                          <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:4}}>{asset.type}</div>
                          <div style={{fontSize:'0.9rem',color:'var(--muted)'}}>{asset.quantity}</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontSize:'1.3rem',fontWeight:700,color:'var(--accent)'}}>{asset.value}</div>
                          {asset.tokenized && (
                            <div style={{fontSize:'0.85rem',color:'var(--muted)',marginTop:4}}>
                              {asset.tokens} {asset.tokenSymbol} tokens
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{display:'flex',gap:12,alignItems:'center'}}>
                        <span style={{
                          padding:'4px 10px',
                          borderRadius:6,
                          fontSize:'0.8rem',
                          fontWeight:600,
                          background: asset.status === 'Active' ? 'rgba(199,255,58,0.1)' : 'rgba(255,193,58,0.1)',
                          color: asset.status === 'Active' ? 'var(--accent)' : '#ffc13a'
                        }}>{asset.status}</span>
                        {asset.tokenized && (
                          <span style={{
                            padding:'4px 10px',
                            borderRadius:6,
                            fontSize:'0.8rem',
                            fontWeight:600,
                            background:'rgba(130,202,157,0.1)',
                            color:'#82ca9d'
                          }}>Tokenized</span>
                        )}
                        {asset.listingStatus === 'Listed' && (
                          <span style={{
                            padding:'4px 10px',
                            borderRadius:6,
                            fontSize:'0.8rem',
                            fontWeight:600,
                            background:'rgba(58,144,255,0.1)',
                            color:'#3a90ff'
                          }}>Listed for Sale</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel style={{padding:28}}>
                <h3 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:20,color:'#fff'}}>Quick Actions</h3>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <button className="btn primary" style={{width:'100%',padding:'14px',fontSize:'1rem'}} onClick={() => setActiveTab('assets')}>
                    📊 View All Assets
                  </button>
                  <button className="btn" style={{width:'100%',padding:'14px',fontSize:'1rem'}} onClick={() => setActiveTab('marketplace')}>
                    🏪 Browse Marketplace
                  </button>
                  <button className="btn" style={{width:'100%',padding:'14px',fontSize:'1rem'}} onClick={() => setActiveTab('loans')}>
                    💰 My Loans
                  </button>
                  <button className="btn" style={{width:'100%',padding:'14px',fontSize:'1rem'}} onClick={() => setActiveTab('kyc')}>
                    📋 KYC Details
                  </button>
                  <button className="btn" style={{width:'100%',padding:'14px',fontSize:'1rem',marginTop:12}} onClick={() => setIsLoggedIn(false)}>
                    🚪 Logout
                  </button>
                </div>
              </GlassPanel>
            </div>
          </>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div style={{display:'flex',flexDirection:'column',gap:24}}>
            {assets.map((asset) => (
              <GlassPanel key={asset.id} style={{padding:28}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:24}}>
                  <div>
                    <h3 style={{fontSize:'1.6rem',fontWeight:700,color:'#fff',marginBottom:8}}>{asset.type}</h3>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <span style={{fontSize:'0.95rem',color:'var(--muted)'}}>ID: {asset.id}</span>
                      <span style={{
                        padding:'4px 10px',
                        borderRadius:6,
                        fontSize:'0.8rem',
                        fontWeight:600,
                        background: asset.status === 'Active' ? 'rgba(199,255,58,0.1)' : 'rgba(255,193,58,0.1)',
                        color: asset.status === 'Active' ? 'var(--accent)' : '#ffc13a'
                      }}>{asset.status}</span>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)',marginBottom:4}}>{asset.value}</div>
                    {asset.tokenized && (
                      <div style={{fontSize:'0.95rem',color:'#82ca9d',fontWeight:600}}>
                        {asset.tokens} {asset.tokenSymbol} Tokens
                      </div>
                    )}
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:24}}>
                  <div>
                    <div className="small-muted" style={{marginBottom:6}}>Quantity</div>
                    <div style={{fontSize:'1.05rem',fontWeight:600,color:'#fff'}}>{asset.quantity}</div>
                  </div>
                  <div>
                    <div className="small-muted" style={{marginBottom:6}}>Purchase Date</div>
                    <div style={{fontSize:'1.05rem',fontWeight:600,color:'#fff'}}>{asset.purchaseDate}</div>
                  </div>
                  <div>
                    <div className="small-muted" style={{marginBottom:6}}>Verification</div>
                    <div style={{fontSize:'1.05rem',fontWeight:600,color:'#fff'}}>{asset.verificationDoc}</div>
                  </div>
                </div>

                <div style={{display:'flex',gap:12,marginBottom:20}}>
                  {asset.status === 'Active' && asset.tokenized && asset.listingStatus === 'Not Listed' && (
                    <button className="btn primary" onClick={() => handleSellAsset(asset)}>
                      🏷️ List for Sale
                    </button>
                  )}
                  {asset.listingStatus === 'Listed' && (
                    <button className="btn" style={{background:'rgba(255,100,100,0.1)',color:'#ff6464'}}>
                      ❌ Remove Listing
                    </button>
                  )}
                  <button className="btn">📄 View Certificate</button>
                  <button className="btn">📊 Transaction History</button>
                </div>

                {/* Matches Section */}
                {asset.matches && asset.matches.length > 0 && (
                  <div style={{
                    marginTop:20,
                    paddingTop:20,
                    borderTop:'1px solid rgba(255,255,255,0.1)'
                  }}>
                    <h4 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:16}}>
                      🎯 Interested Buyers ({asset.matches.length})
                    </h4>
                    <div style={{display:'flex',flexDirection:'column',gap:12}}>
                      {asset.matches.map((match, i) => (
                        <div key={i} style={{
                          padding:16,
                          background:'rgba(58,144,255,0.05)',
                          border:'1px solid rgba(58,144,255,0.2)',
                          borderRadius:12
                        }}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div>
                              <div style={{fontSize:'1.05rem',fontWeight:600,color:'#fff',marginBottom:4}}>
                                👤 {match.buyer}
                              </div>
                              <div style={{fontSize:'0.9rem',color:'var(--muted)'}}>
                                Interested in: <span style={{color:'#fff',fontWeight:600}}>{match.interest}</span>
                              </div>
                            </div>
                            <div style={{textAlign:'right'}}>
                              <div style={{fontSize:'1.2rem',fontWeight:700,color:'var(--accent)',marginBottom:8}}>
                                {match.offer}
                              </div>
                              <div style={{display:'flex',gap:8}}>
                                <button className="btn primary" style={{padding:'8px 16px',fontSize:'0.9rem'}} onClick={() => acceptOffer(match, asset)}>
                                  ✓ Accept
                                </button>
                                <button className="btn" style={{padding:'8px 16px',fontSize:'0.9rem'}}>
                                  ✕ Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassPanel>
            ))}
          </div>
        )}

        {/* Transaction History (Customer) */}
        {tradeHistory && tradeHistory.length > 0 && (
          <div style={{marginTop:24}}>
            <GlassPanel style={{padding:24}}>
              <h3 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Transaction History</h3>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {tradeHistory.map((t) => (
                  <div key={t.tradeId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:12,background:'rgba(255,255,255,0.02)',borderRadius:10}}>
                    <div>
                      <div style={{fontWeight:700,color:'#fff'}}>{t.assetType} • {t.quantity}</div>
                      <div style={{fontSize:'0.9rem',color:'var(--muted)'}}>{new Date(t.timestamp).toLocaleString()}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:700,color:'var(--accent)'}}>₹{t.price}</div>
                      <div style={{fontSize:'0.9rem',color:'var(--muted)'}}>Counterparty: {t.buyerId === (mockCustomerData.accountNumber || mockCustomerData.id) ? t.sellerId : t.buyerId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        )}

        {/* KYC Tab */}
        {activeTab === 'kyc' && (
          <GlassPanel style={{padding:40}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:32}}>
              <div>
                <h3 style={{fontSize:'1.8rem',fontWeight:700,color:'#fff',marginBottom:8}}>KYC Details</h3>
                <div className="small-muted">Your verified identity information</div>
              </div>
              <span style={{
                padding:'10px 20px',
                borderRadius:10,
                fontSize:'1rem',
                fontWeight:700,
                background:'rgba(199,255,58,0.15)',
                color:'var(--accent)'
              }}>✓ {mockCustomerData.kycStatus}</span>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24}}>
              <div>
                <div className="small-muted" style={{marginBottom:8}}>Full Name</div>
                <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:20}}>{mockCustomerData.name}</div>

                <div className="small-muted" style={{marginBottom:8}}>Email Address</div>
                <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:20}}>{mockCustomerData.email}</div>

                <div className="small-muted" style={{marginBottom:8}}>Mobile Number</div>
                <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:20}}>{mockCustomerData.mobile}</div>

                <div className="small-muted" style={{marginBottom:8}}>Customer ID</div>
                <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff'}}>{mockCustomerData.id}</div>
              </div>

              <div>
                <div className="small-muted" style={{marginBottom:8}}>PAN Number</div>
                <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:20}}>{mockCustomerData.panNumber}</div>

                <div className="small-muted" style={{marginBottom:8}}>Aadhaar Number</div>
                <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:20}}>{mockCustomerData.aadhaarNumber}</div>

                <div className="small-muted" style={{marginBottom:8}}>Registered Address</div>
                <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:20}}>{mockCustomerData.address}</div>

                <div className="small-muted" style={{marginBottom:8}}>Wallet Address</div>
                <div style={{fontSize:'0.95rem',fontWeight:600,color:'var(--accent)',fontFamily:'monospace'}}>{mockCustomerData.wallet}</div>
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div>
            {mockLoans.map((loan) => (
              <GlassPanel key={loan.id} style={{padding:32,marginBottom:24}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:24}}>
                  <div>
                    <h3 style={{fontSize:'1.6rem',fontWeight:700,color:'#fff',marginBottom:8}}>Loan {loan.id}</h3>
                    <span style={{
                      padding:'6px 14px',
                      borderRadius:8,
                      fontSize:'0.9rem',
                      fontWeight:600,
                      background:'rgba(130,202,157,0.1)',
                      color:'#82ca9d'
                    }}>{loan.status}</span>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'2.2rem',fontWeight:700,color:'var(--accent)'}}>{loan.amount}</div>
                    <div style={{fontSize:'0.95rem',color:'var(--muted)',marginTop:4}}>Disbursed: {loan.disbursedDate}</div>
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,marginBottom:24}}>
                  <div>
                    <div className="small-muted" style={{marginBottom:8}}>Collateral</div>
                    <div style={{fontSize:'1.1rem',fontWeight:600,color:'#fff'}}>{loan.collateral}</div>
                  </div>
                  <div>
                    <div className="small-muted" style={{marginBottom:8}}>LTV Ratio</div>
                    <div style={{fontSize:'1.1rem',fontWeight:600,color:'#fff'}}>{loan.ltv}</div>
                  </div>
                  <div>
                    <div className="small-muted" style={{marginBottom:8}}>Interest Rate</div>
                    <div style={{fontSize:'1.1rem',fontWeight:600,color:'#fff'}}>{loan.interestRate}</div>
                  </div>
                  <div>
                    <div className="small-muted" style={{marginBottom:8}}>Tenure</div>
                    <div style={{fontSize:'1.1rem',fontWeight:600,color:'#fff'}}>{loan.tenure}</div>
                  </div>
                </div>

                <div style={{
                  padding:20,
                  background:'rgba(199,255,58,0.05)',
                  border:'1px solid rgba(199,255,58,0.2)',
                  borderRadius:12,
                  marginBottom:20
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div className="small-muted" style={{marginBottom:6}}>Next EMI Payment</div>
                      <div style={{fontSize:'1.4rem',fontWeight:700,color:'var(--accent)'}}>{loan.emi}</div>
                      <div style={{fontSize:'0.9rem',color:'var(--muted)',marginTop:4}}>Due on {loan.nextEmiDate}</div>
                    </div>
                    <button className="btn primary" style={{padding:'12px 28px',fontSize:'1rem'}}>
                      💳 Pay Now
                    </button>
                  </div>
                </div>

                <div style={{fontSize:'0.95rem',color:'var(--muted)'}}>
                  Remaining EMIs: <span style={{color:'#fff',fontWeight:600}}>{loan.remainingEmis}</span>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}

        {/* Blockchain Tab */}
        {activeTab === 'blockchain' && (
          <div>
            <div style={{marginBottom:24}}>
              <h3 style={{fontSize:'1.6rem',fontWeight:700,color:'#fff',marginBottom:8}}>Blockchain Transactions</h3>
              <p className="small-muted">All your transactions recorded on the blockchain</p>
            </div>

            {blockchainTxns && blockchainTxns.length > 0 ? (
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                {blockchainTxns.map((tx) => (
                  <GlassPanel key={tx.txHash} style={{padding:24}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>
                          <span style={{
                            fontSize:'1.5rem'
                          }}>{tx.type === 'ASSET_LISTING' ? '🏷️' : tx.type === 'ASSET_SALE' ? '💰' : '🔄'}</span>
                          <span style={{
                            fontSize:'1.1rem',
                            fontWeight:700,
                            color:'#fff'
                          }}>{tx.type.replace(/_/g, ' ')}</span>
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
                  <div>Your blockchain transactions will appear here once you list or sell assets</div>
                </div>
              </GlassPanel>
            )}
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <GlassPanel style={{padding:32}}>
            <h3 style={{fontSize:'1.8rem',fontWeight:700,color:'#fff',marginBottom:24}}>Asset Marketplace</h3>
            <div className="small-muted" style={{marginBottom:32}}>
              Browse and purchase tokenized assets from other customers
            </div>
            <div style={{textAlign:'center',padding:'60px 20px',color:'var(--muted)'}}>
              <div style={{fontSize:'4rem',marginBottom:16}}>🏪</div>
              <div style={{fontSize:'1.2rem',marginBottom:12}}>Marketplace Coming Soon</div>
              <div>Buy and sell tokenized assets with verified customers</div>
            </div>
          </GlassPanel>
        )}
      </div>

      {/* Sell Asset Modal */}
      {sellModal && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:'rgba(0,0,0,0.85)',
          backdropFilter:'blur(8px)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:9999,
          padding:20
        }} onClick={() => setSellModal(false)}>
          <GlassPanel style={{padding:40,maxWidth:560,width:'100%'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={{fontSize:'1.8rem',fontWeight:700,color:'#fff',marginBottom:24}}>
              List Asset for Sale
            </h3>

            <div style={{marginBottom:24,padding:20,background:'rgba(255,255,255,0.02)',borderRadius:12}}>
              <div style={{fontSize:'1.15rem',fontWeight:600,color:'#fff',marginBottom:8}}>
                {selectedAsset?.type}
              </div>
              <div style={{color:'var(--muted)'}}>
                {selectedAsset?.quantity} • {selectedAsset?.tokens} {selectedAsset?.tokenSymbol} tokens
              </div>
            </div>

            <div style={{marginBottom:20}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,color:'#fff'}}>
                Selling Percentage
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={sellForm.percentage}
                onChange={(e) => setSellForm({...sellForm, percentage: e.target.value})}
                style={{width:'100%',marginBottom:8}}
              />
              <div style={{fontSize:'1.3rem',fontWeight:700,color:'var(--accent)',textAlign:'center'}}>
                {sellForm.percentage}% of Asset
              </div>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,color:'#fff'}}>
                Asking Price (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={sellForm.price}
                onChange={(e) => setSellForm({...sellForm, price: e.target.value})}
                placeholder="Enter price"
                style={{width:'100%',padding:'14px 16px',fontSize:'1.1rem'}}
              />
            </div>

            <div style={{display:'flex',gap:12}}>
              <button 
                className="btn primary" 
                onClick={submitSellListing}
                style={{flex:1,padding:'14px',fontSize:'1rem'}}
              >
                List for Sale
              </button>
              <button 
                className="btn" 
                onClick={() => setSellModal(false)}
                style={{padding:'14px 24px',fontSize:'1rem'}}
              >
                Cancel
              </button>
            </div>
          </GlassPanel>
        </div>
      )}

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
