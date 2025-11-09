import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/theme.css';

export default function NavBar(){
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className="navbar"
      style={{
        position: 'fixed',
        top: scrolled ? '12px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: scrolled ? '95%' : '96%',
        maxWidth: scrolled ? '1200px' : '1300px',
        padding: scrolled ? '14px 24px' : '18px 32px',
        borderRadius: scrolled ? '16px' : '20px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: scrolled 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(199, 255, 58, 0.08)' 
          : '0 4px 24px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000
      }}
    >
      <div className="logo" onClick={() => navigate('/')} style={{cursor:'pointer'}}>
        <div 
          className="mark"
          style={{
            width: scrolled ? '36px' : '44px',
            height: scrolled ? '36px' : '44px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(199,255,58,0.3)'
          }}
        >
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
        <div 
          className="name"
          style={{
            fontSize: scrolled ? '0.95rem' : '1.05rem',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Finara
        </div>
      </div>

      <div className="nav-links">
        <a 
          className={isActive('/') && location.pathname === '/' ? 'active' : ''} 
          onClick={() => navigate('/')}
          style={{
            fontSize: scrolled ? '0.9rem' : '1rem',
            padding: scrolled ? '6px 10px' : '8px 12px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Home
        </a>
        <a 
          className={isActive('/login') || isActive('/dashboard') || isActive('/customers') || isActive('/loans') ? 'active' : ''} 
          onClick={() => navigate('/login')}
          style={{
            fontSize: scrolled ? '0.9rem' : '1rem',
            padding: scrolled ? '6px 10px' : '8px 12px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Bank Admin
        </a>
        <a 
          className={isActive('/customer-portal') ? 'active' : ''} 
          onClick={() => navigate('/customer-portal')}
          style={{
            fontSize: scrolled ? '0.9rem' : '1rem',
            padding: scrolled ? '6px 10px' : '8px 12px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Customer
        </a>
        <a 
          className={isActive('/investor') ? 'active' : ''} 
          onClick={() => navigate('/investor')}
          style={{
            fontSize: scrolled ? '0.9rem' : '1rem',
            padding: scrolled ? '6px 10px' : '8px 12px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Investor
        </a>
      </div>
    </div>
  );
}
