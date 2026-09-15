import React from 'react';

export default function Footer({ onSelectCategory, onGoHome }) {
  return (
    <footer className="footer-wrapper">
      <div className="footer-nav">
        <a href="#home" onClick={(e) => { e.preventDefault(); onGoHome(); }}>HOME</a>
        <a href="#bollywood" onClick={(e) => { e.preventDefault(); onSelectCategory('Bollywood'); }}>Bollywood</a>
        <a href="#hollywood" onClick={(e) => { e.preventDefault(); onSelectCategory('Hollywood'); }}>Hollywood</a>
        <a href="#dualaudio" onClick={(e) => { e.preventDefault(); onSelectCategory('Dual Audio'); }}>Dual Audio [Hindi]</a>
        <a href="#webseries" onClick={(e) => { e.preventDefault(); onSelectCategory('Web Series'); }}>Web Series</a>
        <a href="#telugu" onClick={(e) => { e.preventDefault(); onSelectCategory('Telugu'); }}>Telugu</a>
        <a href="#tamil" onClick={(e) => { e.preventDefault(); onSelectCategory('Tamil'); }}>Tamil</a>
        <a href="#dmca" onClick={(e) => { e.preventDefault(); alert('DMCA Notice: This is an educational demonstration React replica of the Vegamovies UI.'); }}>DMCA</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Contact: support@vegamovies-demo.local'); }}>Contact Us</a>
      </div>

      <p className="footer-disclaimer">
        Vegamovies is a movie discovery and download showcase portal. All trademarks, screenshots, logos and images belong to their respective copyright holders. Designed and developed with modern React, responsive CSS, and high-performance layout architecture.
      </p>

      <div style={{ color: '#4b5563', fontSize: '0.72rem' }}>
        © 2026 Vegamovies Official. All Rights Reserved.
      </div>
    </footer>
  );
}
