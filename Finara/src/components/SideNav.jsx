import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/theme.css';

export default function SideNav({ active }){
  const navigate = useNavigate();
  const location = useLocation();
  
  const items = [
    { id: 'dashboard', label: '📊 Dashboard', path: '/dashboard' },
    { id: 'customers', label: '👥 Customers', path: '/customers' },
    { id: 'loans', label: '💰 Loans', path: '/loans' },
    { id: 'bank', label: '🏦 Bank Console', path: '/bank' },
    { id: 'reports', label: '📁 Reports', path: '/reports' },
  ];

  const isActive = (item) => {
    if (active) return active === item.id;
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  return (
    <aside className="side-nav glass-panel">
      <div style={{marginBottom:24,padding:'0 12px'}}>
        <div style={{cursor:'pointer'}} onClick={() => navigate('/')}>
          <div style={{
            width:48,
            height:48,
            borderRadius:'50%',
            background:'linear-gradient(135deg, rgba(199,255,58,0.14), rgba(155,225,43,0.06))',
            display:'grid',
            placeItems:'center',
            marginBottom:12,
            border:'2px solid rgba(199,255,58,0.25)',
            overflow:'hidden'
          }}>
            <img 
              src="/finara-logo.jpg" 
              alt="Finara Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div style={{fontSize:'1.1rem',fontWeight:700,color:'var(--accent)'}}>Finara</div>
          <div style={{fontSize:'0.75rem',color:'var(--muted)'}}>Banking Platform</div>
        </div>
      </div>

      <div style={{marginBottom:16}}>
        <div className="section-title">Navigation</div>
        {items.map(i => (
          <div 
            key={i.id} 
            className={`nav-item ${isActive(i)? 'active':''}`} 
            onClick={()=>navigate(i.path)}
          >
            <div style={{fontSize:'1.1rem'}}>{i.label.split(' ')[0]}</div>
            <div style={{fontWeight:500}}>{i.label.split(' ').slice(1).join(' ')}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop:20}}>
        <div className="section-title">Quick Actions</div>
        <div className="nav-item" onClick={()=>navigate('/customer/add')}>
          <span>+ Add Customer</span>
        </div>
        <div className="nav-item" onClick={()=>navigate('/login')}>
          <span>🔐 Logout</span>
        </div>
      </div>
    </aside>
  );
}
