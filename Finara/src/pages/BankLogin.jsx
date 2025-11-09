import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import GlassPanel from '../components/GlassPanel';
import Footer from '../components/Footer';
import '../styles/theme.css';

export default function BankLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - in production, validate with backend
    if (formData.email && formData.password) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:'#000'}}>
      <NavBar />
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
        <GlassPanel style={{maxWidth:520,width:'100%',padding:'56px 48px'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{
              fontSize:'4rem',
              marginBottom:20,
              filter:'drop-shadow(0 4px 12px rgba(199,255,58,0.2))'
            }}>🏦</div>
            <h1 style={{fontSize:'2.2rem',fontWeight:700,marginBottom:12,color:'#fff',letterSpacing:'-0.02em'}}>
              Bank Admin Login
            </h1>
            <p className="small-muted" style={{fontSize:'1.05rem',lineHeight:1.6}}>
              Access your banking dashboard and management tools
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:10,fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>
                Bank ID / Email
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@finara.com"
                style={{
                  width:'100%',
                  padding:'16px 18px',
                  fontSize:'1rem',
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:12,
                  color:'#fff',
                  outline:'none',
                  transition:'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                required
              />
            </div>

            <div style={{marginBottom:32}}>
              <label style={{display:'block',marginBottom:10,fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
                style={{
                  width:'100%',
                  padding:'16px 18px',
                  fontSize:'1rem',
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:12,
                  color:'#fff',
                  outline:'none',
                  transition:'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                required
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
                Password: <span style={{color:'var(--accent)',fontWeight:600,fontFamily:'monospace'}}>any password</span>
              </div>
            </div>

            <div style={{textAlign:'center',fontSize:'0.9rem',color:'var(--muted)'}}>
              Need access? <a href="#" style={{color:'var(--accent)',textDecoration:'none',fontWeight:600}}>Contact Admin</a>
            </div>
          </form>
        </GlassPanel>
      </div>
      <Footer />
    </div>
  );
}
