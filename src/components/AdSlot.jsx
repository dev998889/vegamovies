import React, { useEffect, useRef } from 'react';

export default function AdSlot() {
  const adRef = useRef(null);

  useEffect(() => {
    // If the banner script hasn't been loaded in this container, inject it
    if (adRef.current && !adRef.current.hasChildNodes()) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '46daeaaa8cf549b130b5f09ab768a937',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highrevenueformat.com/46daeaaa8cf549b130b5f09ab768a937/invoke.js';

      adRef.current.appendChild(confScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ fontSize: '0.68rem', color: '#555', letterSpacing: '1px', textTransform: 'uppercase' }}>
        — Sponsored Advertisement —
      </div>

      {/* 728x90 Banner Ad Container */}
      <div 
        ref={adRef} 
        style={{ 
          minHeight: '90px', 
          maxWidth: '100%', 
          overflow: 'hidden', 
          display: 'flex', 
          justifyContent: 'center',
          background: '#0a0a0c',
          borderRadius: '4px',
          border: '1px solid #1a1a1e'
        }} 
      />

      {/* Direct Link Banner */}
      <a 
        href="https://www.profitableratecpmnetwork.com/t72z1v1b?key=bd2a5479a26b7b5df99322d6ec146898"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(90deg, #b21f2d 0%, #e50914 100%)',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: '700',
          padding: '8px 18px',
          borderRadius: '4px',
          boxShadow: '0 0 15px rgba(229, 9, 20, 0.4)',
          textDecoration: 'none'
        }}
      >
        ⚡ FAST CLOUD HIGH-SPEED DIRECT DOWNLOAD [PRO] ⚡
      </a>
    </div>
  );
}
