import React from 'react';
import '../styles/theme.css';

export default function SideNav({ current, onSelect }){
  const items = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'onboarding', label: 'Customer Onboarding' },
    { id: 'tokenization', label: 'Asset Tokenization' },
    { id: 'loans', label: 'Loan Management' },
    { id: 'analytics', label: 'Portfolio Analytics' },
  ];

  return (
    <aside className="side-nav glass-panel">
      <div style={{marginBottom:16}}>
        <div className="section-title">Bank Console</div>
        {items.map(i => (
          <div key={i.id} className={`nav-item ${current===i.id? 'active':''}`} onClick={()=>onSelect(i.id)}>
            <div style={{width:10,height:10,background: current===i.id? 'var(--accent)':'transparent',borderRadius:3}}></div>
            <div style={{fontWeight:500}}>{i.label}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop:20}}>
        <div className="section-title">Quick Actions</div>
        <div className="nav-item" onClick={()=>onSelect('deploy')}>Deploy Bank</div>
        <div className="nav-item" onClick={()=>onSelect('mint')}>Mint Tokens</div>
      </div>
    </aside>
  );
}
