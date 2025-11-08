import React from 'react';
import '../styles/theme.css';

export default function NavBar({ onNavigate, current }){
  return (
    <div className="navbar">
      <div className="logo">
        <div className="mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="rgba(199,255,58,0.24)" strokeWidth="1.5" />
            <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="name">Finara</div>
      </div>

      <div className="nav-links">
        <a className={current==='landing'?'active':''} onClick={()=>onNavigate('landing')}>Home</a>
        <a className={current==='bank'?'active':''} onClick={()=>onNavigate('bank')}>Bank Admin</a>
        <a className={current==='customer'?'active':''} onClick={()=>onNavigate('customer')}>Customer</a>
        <a className={current==='investor'?'active':''} onClick={()=>onNavigate('investor')}>Investor</a>
        <a className={current==='compliance'?'active':''} onClick={()=>onNavigate('compliance')}>Compliance</a>
      </div>
    </div>
  );
}
