import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import GridScan from '../components/GridScan';
import GlassPanel from '../components/GlassPanel';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles/theme.css';

export default function Landing({ onExplore }){
  const [activeBar, setActiveBar] = useState(-1);

  const bars = [
    {
      icon: '🏦',
      title: 'For Banks',
      brief: 'Deploy tokenization infrastructure in minutes',
      content: 'One-click deployment, KYC management, real-time analytics, and audit logs for compliance.'
    },
    {
      icon: '👤',
      title: 'For Customers',
      brief: 'Apply for loans backed by tokenized assets',
      content: 'Instant loan applications, digital wallet, EMI tracking, and secure multi-factor authentication.'
    },
    {
      icon: '📈',
      title: 'For Investors',
      brief: 'Access marketplace of tokenized assets',
      content: 'Live marketplace, portfolio visualizations, ROI tracking, and order book management.'
    },
    {
      icon: '⚡',
      title: 'Performance',
      brief: 'Enterprise-grade infrastructure',
      content: '99.8% uptime, 2.5s block confirmation, gas-optimized contracts, horizontal scaling.'
    }
  ];

  return (
    <div style={{width:'100%',background:'transparent',paddingTop:'90px'}}>
      <NavBar />
      
      {/* Hero Section */}
      <div style={{minHeight:'85vh',display:'flex',alignItems:'center',marginBottom:80,padding:'40px 48px'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',width:'100%'}}>
        <div className="grid" style={{alignItems:'center',width:'100%'}}>
          <motion.div 
            className="col-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              style={{display:'inline-block',padding:'8px 16px',borderRadius:8,background:'linear-gradient(90deg, rgba(199,255,58,0.08), rgba(155,225,43,0.04))',border:'1px solid rgba(199,255,58,0.12)',marginBottom:20}}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span style={{color:'var(--accent)',fontSize:'0.9rem',fontWeight:600}}> Next-Gen Web3 Banking Infrastructure</span>
            </motion.div>
            <motion.h1 
              style={{fontSize:'3.8rem',fontWeight:800,margin:'0 0 24px',lineHeight:1.1,background:'linear-gradient(135deg, #fff 0%, var(--accent) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Tokenize Assets.<br/>Lend with Confidence.
            </motion.h1>
            <motion.p 
              className="lead" 
              style={{fontSize:'1.25rem',lineHeight:1.7,marginBottom:36,color:'rgba(255,255,255,0.8)'}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Transform traditional banking with blockchain technology. Finara empowers banks to tokenize real-world assets, issue collateralized loans, and maintain regulatory compliance—all on-chain.
            </motion.p>
            <motion.div 
              style={{display:'flex',gap:16,alignItems:'center',marginBottom:40}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <button className="btn primary" onClick={()=>onExplore('bank')} style={{fontSize:'1.05rem',padding:'16px 32px',fontWeight:600,boxShadow:'0 8px 32px rgba(155,225,43,0.24)'}}>
                Get Started →
              </button>
              <button className="btn" onClick={()=>onExplore('investor')} style={{fontSize:'1.05rem',padding:'16px 32px'}}>
                Explore Marketplace
              </button>
            </motion.div>
            <motion.div 
              style={{display:'flex',gap:40,alignItems:'center'}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
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
            </motion.div>
          </motion.div>


          <motion.div 
            className="col-6" 
            style={{display:'flex',justifyContent:'center',alignItems:'center'}}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
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
              <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)',width:380,height:380,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                <DotLottieReact
                  src="https://lottie.host/822907be-9035-41a1-aaf2-b338277576bc/6pQCOGcvF2.lottie"
                  loop
                  autoplay
                  style={{width:'100%',height:'100%'}}
                />
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </div>

      {/* What is Finara Section */}
      <motion.div 
        style={{marginBottom:80,padding:'40px 48px',background:'transparent'}}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'2.8rem',fontWeight:700,margin:'0 0 16px',color:'#fff'}}>What is Finara?</h2>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(12, 1fr)',gap:24,marginBottom:32}}>
          {/* Large box - Asset Tokenization */}
          <motion.div 
            style={{gridColumn:'span 7'}}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassPanel style={{padding:32,height:'100%',minHeight:280,border:'1px solid rgba(199,255,58,0.2)',boxShadow:'0 0 20px rgba(199,255,58,0.08), inset 0 1px 0 rgba(199,255,58,0.1)'}}>
              <div style={{fontSize:'3.5rem',marginBottom:20}}>🪙</div>
              <h4 style={{fontSize:'1.5rem',fontWeight:700,marginBottom:16,color:'#fff'}}>Asset Tokenization</h4>
              <p className="small-muted" style={{fontSize:'1.05rem',lineHeight:1.7}}>
                Convert physical assets like gold, real estate, and securities into ERC-3643 compliant tokens. Each token represents fractional ownership with full regulatory compliance.
              </p>
              <div style={{marginTop:24,display:'flex',gap:12,flexWrap:'wrap'}}>
                <span style={{padding:'6px 14px',background:'rgba(199,255,58,0.08)',border:'1px solid rgba(199,255,58,0.15)',borderRadius:20,fontSize:'0.85rem',color:'var(--accent)'}}>ERC-3643</span>
                <span style={{padding:'6px 14px',background:'rgba(199,255,58,0.08)',border:'1px solid rgba(199,255,58,0.15)',borderRadius:20,fontSize:'0.85rem',color:'var(--accent)'}}>Fractional Ownership</span>
                <span style={{padding:'6px 14px',background:'rgba(199,255,58,0.08)',border:'1px solid rgba(199,255,58,0.15)',borderRadius:20,fontSize:'0.85rem',color:'var(--accent)'}}>Real-World Assets</span>
              </div>
            </GlassPanel>
          </motion.div>
          
          {/* Medium box - Collateralized Lending */}
          <motion.div 
            style={{gridColumn:'span 5'}}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassPanel style={{padding:28,height:'100%',minHeight:280,border:'1px solid rgba(199,255,58,0.18)',boxShadow:'0 0 16px rgba(199,255,58,0.06), inset 0 1px 0 rgba(199,255,58,0.08)'}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>🔒</div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Collateralized Lending</h4>
              <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
                Issue loans backed by tokenized assets with customizable collateralization ratios. Smart contracts automate loan disbursement, interest calculation, and liquidation.
              </p>
            </GlassPanel>
          </motion.div>

          {/* Small box - Compliance */}
          <motion.div 
            style={{gridColumn:'span 5'}}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassPanel style={{padding:28,height:'100%',minHeight:220,border:'1px solid rgba(199,255,58,0.18)',boxShadow:'0 0 16px rgba(199,255,58,0.06), inset 0 1px 0 rgba(199,255,58,0.08)'}}>
              <div style={{fontSize:'2.8rem',marginBottom:16}}>✓</div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Compliance & Auditing</h4>
              <p className="small-muted" style={{fontSize:'0.95rem',lineHeight:1.6}}>
                Built-in KYC verification, freeze controls, and comprehensive audit trails. Export compliance reports for regulatory submissions.
              </p>
            </GlassPanel>
          </motion.div>

          {/* Tall box - Tech Stack */}
          <motion.div 
            style={{gridColumn:'span 7'}}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassPanel style={{padding:32,height:'100%',minHeight:220,border:'1px solid rgba(199,255,58,0.2)',boxShadow:'0 0 20px rgba(199,255,58,0.08), inset 0 1px 0 rgba(199,255,58,0.1)'}}>
              <h4 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:20,color:'#fff'}}>🚀 Powered by Industry Standards</h4>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)'}}></div>
                    <span style={{fontSize:'0.95rem'}}>Solidity ^0.8.20</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)'}}></div>
                    <span style={{fontSize:'0.95rem'}}>Hardhat Framework</span>
                  </div>
                </div>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)'}}></div>
                    <span style={{fontSize:'0.95rem'}}>Supabase DB</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)'}}></div>
                    <span style={{fontSize:'0.95rem'}}>React + Vite</span>
                  </div>
                </div>
              </div>
              <div style={{marginTop:20,padding:16,background:'rgba(199,255,58,0.04)',borderRadius:12,border:'1px solid rgba(199,255,58,0.08)'}}>
                <div style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:8}}>Enterprise Features</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  <span style={{fontSize:'0.8rem',color:'var(--accent)'}}>Multi-sig Wallets</span>
                  <span style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>•</span>
                  <span style={{fontSize:'0.8rem',color:'var(--accent)'}}>Real-time Monitoring</span>
                  <span style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>•</span>
                  <span style={{fontSize:'0.8rem',color:'var(--accent)'}}>RBAC</span>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
        </div>
      </motion.div>

      {/* Why Finara Section */}
      <motion.div 
        style={{marginBottom:80,padding:'40px 48px',background:'transparent'}}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'2.8rem',fontWeight:700,margin:'0 0 16px',color:'#fff'}}>Why Choose Finara?</h2>
          <p className="lead" style={{fontSize:'1.15rem',maxWidth:800,margin:'0 auto',color:'var(--muted)'}}>
            Built for banks, designed for the future. Finara bridges traditional finance with Web3 innovation.
          </p>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Horizontal Bars */}
          {bars.map((bar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveBar(activeBar === index ? -1 : index)}
              style={{
                background: activeBar === index 
                  ? 'linear-gradient(135deg, rgba(199,255,58,0.12), rgba(155,225,43,0.04))' 
                  : 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                border: activeBar === index 
                  ? '1px solid rgba(199,255,58,0.25)' 
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: activeBar === index ? '28px 32px' : '20px 32px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                backdropFilter: 'blur(12px)',
                boxShadow: activeBar === index 
                  ? '0 8px 32px rgba(199,255,58,0.15), inset 0 1px 0 rgba(199,255,58,0.15)' 
                  : '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {/* Bar Header - Always Visible */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <div style={{
                    fontSize: activeBar === index ? '2.8rem' : '2.2rem',
                    transition: 'font-size 0.4s ease'
                  }}>
                    {bar.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: activeBar === index ? '1.6rem' : '1.3rem',
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                      transition: 'font-size 0.4s ease'
                    }}>
                      {bar.title}
                    </h4>
                    <p style={{
                      fontSize: '0.95rem',
                      color: activeBar === index ? 'var(--accent)' : 'var(--muted)',
                      margin: '4px 0 0',
                      transition: 'color 0.4s ease'
                    }}>
                      {bar.brief}
                    </p>
                  </div>
                </div>
                
                {/* Expand/Collapse Icon */}
                <div style={{
                  fontSize: '1.5rem',
                  color: activeBar === index ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                  transform: activeBar === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'all 0.4s ease'
                }}>
                  ▼
                </div>
              </div>

              {/* Expanded Content */}
              <div style={{
                maxHeight: activeBar === index ? '200px' : '0',
                opacity: activeBar === index ? 1 : 0,
                marginTop: activeBar === index ? '20px' : '0',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: 20,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 12,
                  border: '1px solid rgba(199,255,58,0.1)'
                }}>
                  <p style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.85)',
                    margin: 0
                  }}>
                    {bar.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
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
      </motion.div>

      {/* How to Join Us Section */}
      <motion.div 
        style={{marginBottom:60,padding:'40px 48px',background:'transparent'}}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'2.8rem',fontWeight:700,margin:'0 0 16px',color:'#fff'}}>How to Get Started</h2>
          <p className="lead" style={{fontSize:'1.15rem',maxWidth:800,margin:'0 auto',color:'var(--muted)'}}>
            Launch your Web3 banking infrastructure in three simple steps. No blockchain expertise required.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,marginBottom:40}}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassPanel style={{padding:32,textAlign:'center',position:'relative'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg, rgba(199,255,58,0.2), rgba(155,225,43,0.1))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',border:'2px solid rgba(199,255,58,0.3)'}}>
                <span style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>1</span>
              </div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Deploy Your Bank</h4>
              <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
                Use the Bank Admin dashboard to deploy your tokenization infrastructure. Configure token parameters, set collateralization ratios, and customize compliance rules.
              </p>
            </GlassPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassPanel style={{padding:32,textAlign:'center',position:'relative'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg, rgba(199,255,58,0.2), rgba(155,225,43,0.1))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',border:'2px solid rgba(199,255,58,0.3)'}}>
                <span style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>2</span>
              </div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Onboard Customers</h4>
              <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
                Verify customer KYC, approve wallet addresses, and tokenize their assets. Customers can apply for loans directly through the Customer Portal.
              </p>
            </GlassPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassPanel style={{padding:32,textAlign:'center',position:'relative'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg, rgba(199,255,58,0.2), rgba(155,225,43,0.1))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',border:'2px solid rgba(199,255,58,0.3)'}}>
                <span style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>3</span>
              </div>
              <h4 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:12,color:'#fff'}}>Manage & Grow</h4>
              <p className="small-muted" style={{fontSize:'1rem',lineHeight:1.6}}>
                Monitor portfolio analytics, manage loan lifecycles, track compliance, and scale your operations. Export audit logs for regulatory submissions.
              </p>
            </GlassPanel>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
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
        </motion.div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
