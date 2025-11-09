import React from 'react';

function Footer() {
  return (
    <footer style={{
      padding: '32px 48px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(12px)',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(199,255,58,0.3)'
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
        <span style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--accent)'
        }}>Finara</span>
      </div>
      <p style={{
        margin: 0,
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 500
      }}>
        Made by Team <span style={{color: 'var(--accent)', fontWeight: 600}}>Hacka Noodles</span> in 2025
      </p>
    </footer>
  );
}

export default Footer;
