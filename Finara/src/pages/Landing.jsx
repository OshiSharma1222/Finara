import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { GridScan } from '../components/GridScan.tsx';
import GlassPanel from '../components/GlassPanel';
import '../styles/theme.css';

export default function Landing({ onExplore }){
  return (
    <div style={{width:'100%',background:'transparent'}}>
      {/* Hero Section */}
      <div style={{minHeight:'85vh',display:'flex',alignItems:'center',marginBottom:80,padding:'40px 48px'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',width:'100%'}}>
        <div className="grid" style={{alignItems:'center',width:'100%'}}>
          <div className="col-6">
            <div style={{display:'inline-block',padding:'8px 16px',borderRadius:8,background:'linear-gradient(90deg, rgba(199,255,58,0.08), rgba(155,225,43,0.04))',border:'1px solid rgba(199,255,58,0.12)',marginBottom:20}}>
              <span style={{color:'var(--accent)',fontSize:'0.9rem',fontWeight:600}}>🚀 Next-Gen Web3 Banking Infrastructure</span>
            </div>
            <h1 style={{fontSize:'3.8rem',fontWeight:800,margin:'0 0 24px',lineHeight:1.1,background:'linear-gradient(135deg, #fff 0%, var(--accent) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Tokenize Assets.<br/>Lend with Confidence.
            </h1>
            <p className="lead" style={{fontSize:'1.25rem',lineHeight:1.7,marginBottom:36,color:'rgba(255,255,255,0.8)'}}>
              Transform traditional banking with blockchain technology. Finara empowers banks to tokenize real-world assets, issue collateralized loans, and maintain regulatory compliance—all on-chain.
            </p>
            <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:40}}>
              <button className="btn primary" onClick={()=>onExplore('bank')} style={{fontSize:'1.05rem',padding:'16px 32px',fontWeight:600,boxShadow:'0 8px 32px rgba(155,225,43,0.24)'}}>
                Get Started →
              </button>
              <button className="btn" onClick={()=>onExplore('investor')} style={{fontSize:'1.05rem',padding:'16px 32px'}}>
                Explore Marketplace
              </button>
            </div>
            <div style={{display:'flex',gap:40,alignItems:'center'}}>
              <div>
                <div style={{fontSize:'2.4rem',fontWeight:700,color:'var(--accent)'}}>$2.4M+</div>
                <div className="small-muted">Assets Tokenized</div>
              </div>
              <div>
                <div style={{fontSize:'2.4rem',fontWeight:700,color:'var(--accent)'}}>175%</div>
                <div className="small-muted">Avg Collateralization</div>
              </div>
              <div>
                <div style={{fontSize:'2.4rem',fontWeight:700,color:'var(--accent)'}}>99.8%</div>
                <div className="small-muted">Platform Uptime</div>
              </div>
            </div>
          </div>


          <div className="col-6" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div style={{position:'relative',width:'100%',height:'500px',maxWidth:'600px'}}>
              <GridScan
                linesColor="#c7ff3a"
                scanColor="#9be12b"
                scanOpacity={0.25}
                lineThickness={1.2}
                gridScale={0.12}
                lineStyle="solid"
                scanDirection="pingpong"
                scanDuration={3.0}
                scanDelay={1.5}
                sensitivity={0.6}
                bloomIntensity={0.15}
                enablePost={true}
                style={{width:'100%',height:'100%',opacity:0.7}}
              />
              <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)',width:280,height:280,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                <DotLottieReact
                  src="https://lottie.host/822907be-9035-41a1-aaf2-b338277576bc/6pQCOGcvF2.lottie"
                  loop
                  autoplay
                  style={{width:'100%',height:'100%'}}
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* What is Finara Section */}
      <div style={{marginBottom:80,padding:'40px 48px',background:'transparent'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'2.8rem',fontWeight:700,margin:'0 0 16px',color:'#fff'}}>What is Finara?</h2>
          <p className="lead" style={{fontSize:'1.15rem',maxWidth:800,margin:'0 auto',color:'var(--muted)'}}>
            A comprehensive blockchain-based infrastructure that enables financial institutions to tokenize real-world assets and issue compliant, collateralized loans on-chain.
          </p>
        </div>

        <div className="grid" style={{marginBottom:32}}>
          <div className="col-4">
            <GlassPanel style={{padding:28,height:'100%'}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>🪙</div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Asset Tokenization</h4>
              <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
                Convert physical assets like gold, real estate, and securities into ERC-3643 compliant tokens. Each token represents fractional ownership with full regulatory compliance.
              </p>
            </GlassPanel>
          </div>
          <div className="col-4">
            <GlassPanel style={{padding:28,height:'100%'}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>🔒</div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Collateralized Lending</h4>
              <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
                Issue loans backed by tokenized assets with customizable collateralization ratios. Smart contracts automate loan disbursement, interest calculation, and liquidation.
              </p>
            </GlassPanel>
          </div>
          <div className="col-4">
            <GlassPanel style={{padding:28,height:'100%'}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>✓</div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Compliance & Auditing</h4>
              <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
                Built-in KYC verification, freeze controls, and comprehensive audit trails. Export compliance reports for regulatory submissions with blockchain-verified timestamps.
              </p>
            </GlassPanel>
          </div>
        </div>

        <GlassPanel style={{padding:32}}>
          <div className="grid">
            <div className="col-6">
              <h4 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:16,color:'#fff'}}>Powered by Industry Standards</h4>
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>Solidity ^0.8.20 with OpenZeppelin contracts</span>
                </li>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>Hardhat development & testing framework</span>
                </li>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>Supabase for off-chain data management</span>
                </li>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>React + Vite for high-performance UI</span>
                </li>
              </ul>
            </div>
            <div className="col-6">
              <h4 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:16,color:'#fff'}}>Enterprise-Ready Features</h4>
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>Multi-signature wallet support</span>
                </li>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>Real-time transaction monitoring</span>
                </li>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>Automated compliance checks</span>
                </li>
                <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}></div>
                  <span>Role-based access control (RBAC)</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassPanel>
        </div>
      </div>

      {/* Why Finara Section */}
      <div style={{marginBottom:80,padding:'40px 48px',background:'transparent'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'2.8rem',fontWeight:700,margin:'0 0 16px',color:'#fff'}}>Why Choose Finara?</h2>
          <p className="lead" style={{fontSize:'1.15rem',maxWidth:800,margin:'0 auto',color:'var(--muted)'}}>
            Built for banks, designed for the future. Finara bridges traditional finance with Web3 innovation.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24,marginBottom:32}}>
          <GlassPanel style={{padding:32}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:20}}>
              <div style={{fontSize:'2.5rem'}}>🏦</div>
              <div>
                <h4 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:12,color:'#fff'}}>For Banks & Financial Institutions</h4>
                <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6,marginBottom:16}}>
                  Deploy your own tokenization infrastructure in minutes. Customize collateralization ratios, interest rates, and compliance rules to match your business model.
                </p>
                <ul style={{listStyle:'none',padding:0,margin:0}}>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ One-click bank deployment via factory contracts</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Manage customer onboarding and KYC verification</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Track portfolio analytics with real-time dashboards</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Export audit logs for regulatory compliance</li>
                </ul>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel style={{padding:32}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:20}}>
              <div style={{fontSize:'2.5rem'}}>👤</div>
              <div>
                <h4 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:12,color:'#fff'}}>For Customers</h4>
                <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6,marginBottom:16}}>
                  Apply for loans backed by your tokenized assets. View your digital wallet, track EMI schedules, and manage your portfolio from a sleek, intuitive dashboard.
                </p>
                <ul style={{listStyle:'none',padding:0,margin:0}}>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Instant loan application with collateral calculator</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ View tokenized assets and transaction history</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Automated EMI reminders and payment tracking</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Secure wallet with multi-factor authentication</li>
                </ul>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel style={{padding:32}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:20}}>
              <div style={{fontSize:'2.5rem'}}>📈</div>
              <div>
                <h4 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:12,color:'#fff'}}>For Investors</h4>
                <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6,marginBottom:16}}>
                  Access a marketplace of tokenized assets. Buy and sell tokens, track portfolio performance, and analyze yield opportunities with interactive charts and analytics.
                </p>
                <ul style={{listStyle:'none',padding:0,margin:0}}>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Live marketplace with real-time price feeds</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Portfolio allocation visualizations with Recharts</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ ROI calculator and profit/loss tracking</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Order book with pending and filled trades</li>
                </ul>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel style={{padding:32}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:20}}>
              <div style={{fontSize:'2.5rem'}}>⚡</div>
              <div>
                <h4 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Unmatched Performance</h4>
                <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6,marginBottom:16}}>
                  Built with cutting-edge technology for speed, security, and scalability. Enterprise-grade infrastructure that grows with your business.
                </p>
                <ul style={{listStyle:'none',padding:0,margin:0}}>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ 99.8% uptime with redundant infrastructure</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ 2.5s average block confirmation time</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Gas-optimized smart contracts (200 optimizer runs)</li>
                  <li style={{marginBottom:8,color:'var(--muted)'}}>✓ Scalable architecture with horizontal scaling</li>
                </ul>
              </div>
            </div>
          </GlassPanel>
        </div>

        <GlassPanel style={{padding:40,textAlign:'center',background:'linear-gradient(135deg, rgba(199,255,58,0.06), rgba(155,225,43,0.02))'}}>
          <h3 style={{fontSize:'1.8rem',fontWeight:700,marginBottom:16,color:'#fff'}}>Trusted by Leading Financial Institutions</h3>
          <p className="small-muted" style={{fontSize:'1.05rem',marginBottom:24}}>
            Finara is designed for enterprise deployment with security, compliance, and scalability at its core.
          </p>
          <div style={{display:'flex',gap:40,justifyContent:'center',flexWrap:'wrap'}}>
            <div>
              <div style={{fontSize:'2.6rem',fontWeight:700,color:'var(--accent)'}}>175%</div>
              <div className="small-muted">Avg Collateralization Ratio</div>
            </div>
            <div>
              <div style={{fontSize:'2.6rem',fontWeight:700,color:'var(--accent)'}}>$2.4M+</div>
              <div className="small-muted">Total Value Locked</div>
            </div>
            <div>
              <div style={{fontSize:'2.6rem',fontWeight:700,color:'var(--accent)'}}>142</div>
              <div className="small-muted">Audit Records</div>
            </div>
            <div>
              <div style={{fontSize:'2.6rem',fontWeight:700,color:'var(--accent)'}}>2.5s</div>
              <div className="small-muted">Block Confirmation</div>
            </div>
          </div>
        </GlassPanel>
        </div>
      </div>

      {/* How to Join Us Section */}
      <div style={{marginBottom:60,padding:'40px 48px',background:'transparent'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'2.8rem',fontWeight:700,margin:'0 0 16px',color:'#fff'}}>How to Get Started</h2>
          <p className="lead" style={{fontSize:'1.15rem',maxWidth:800,margin:'0 auto',color:'var(--muted)'}}>
            Launch your Web3 banking infrastructure in three simple steps. No blockchain expertise required.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,marginBottom:40}}>
          <GlassPanel style={{padding:32,textAlign:'center',position:'relative'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg, rgba(199,255,58,0.2), rgba(155,225,43,0.1))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',border:'2px solid rgba(199,255,58,0.3)'}}>
              <span style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>1</span>
            </div>
            <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Deploy Your Bank</h4>
            <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
              Use the Bank Admin dashboard to deploy your tokenization infrastructure. Configure token parameters, set collateralization ratios, and customize compliance rules.
            </p>
          </GlassPanel>

          <GlassPanel style={{padding:32,textAlign:'center',position:'relative'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg, rgba(199,255,58,0.2), rgba(155,225,43,0.1))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',border:'2px solid rgba(199,255,58,0.3)'}}>
              <span style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>2</span>
            </div>
            <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Onboard Customers</h4>
            <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
              Verify customer KYC, approve wallet addresses, and tokenize their assets. Customers can apply for loans directly through the Customer Portal.
            </p>
          </GlassPanel>

          <GlassPanel style={{padding:32,textAlign:'center',position:'relative'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg, rgba(199,255,58,0.2), rgba(155,225,43,0.1))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',border:'2px solid rgba(199,255,58,0.3)'}}>
              <span style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>3</span>
            </div>
            <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Manage & Grow</h4>
            <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
              Monitor portfolio analytics, manage loan lifecycles, track compliance, and scale your operations. Export audit logs for regulatory submissions.
            </p>
          </GlassPanel>
        </div>

        <GlassPanel style={{padding:48,textAlign:'center',background:'linear-gradient(135deg, rgba(199,255,58,0.04), rgba(155,225,43,0.01))'}}>
          <h3 style={{fontSize:'2rem',fontWeight:700,marginBottom:20,color:'#fff'}}>Ready to Transform Your Banking Infrastructure?</h3>
          <p className="lead" style={{fontSize:'1.1rem',marginBottom:32,maxWidth:700,margin:'0 auto 32px',color:'var(--muted)'}}>
            Join the future of finance. Deploy your tokenization platform today and start issuing compliant, collateralized loans on-chain.
          </p>
          <div style={{display:'flex',gap:16,justifyContent:'center',alignItems:'center'}}>
            <button className="btn primary" onClick={()=>onExplore('bank')} style={{fontSize:'1.1rem',padding:'16px 40px',fontWeight:600,boxShadow:'0 8px 32px rgba(155,225,43,0.24)'}}>
              Launch Bank Admin Dashboard →
            </button>
            <button className="btn" onClick={()=>onExplore('investor')} style={{fontSize:'1.1rem',padding:'16px 40px'}}>
              Explore Investor Marketplace
            </button>
          </div>
          <div style={{marginTop:32,display:'flex',gap:32,justifyContent:'center',alignItems:'center',fontSize:'0.95rem',color:'var(--muted)'}}>
            <span>✓ No credit card required</span>
            <span>✓ Deploy in under 5 minutes</span>
            <span>✓ Full documentation & support</span>
          </div>
        </GlassPanel>
        </div>
      </div>
    </div>
  );
}
