import React from 'react';
import '../styles/theme.css';

export default function Card({ title, subtitle, children, className = '' }){
  return (
    <div className={`card ${className}`}>
      {title && <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div>
          <div style={{fontWeight:600,color:'#fff'}}>{title}</div>
          {subtitle && <div className="small-muted">{subtitle}</div>}
        </div>
      </div>}
      <div>{children}</div>
    </div>
  );
}
