import React, { useState, useEffect } from 'react';
import { X, Download, Server, Play, CheckCircle2, ShieldCheck, HardDrive, ExternalLink } from 'lucide-react';

export default function DownloadModal({ movie, downloadTier, onClose }) {
  const [countdown, setCountdown] = useState(2);
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleStartDownload = (serverName) => {
    setDownloading(serverName);
    setTimeout(() => {
      setDownloading(false);
      setCompleted(true);
      
      // Open configured link from MongoDB if present
      const targetUrl = downloadTier.link && downloadTier.link !== '#' 
        ? downloadTier.link 
        : 'https://drive.google.com';

      window.open(targetUrl, '_blank');

      setTimeout(() => setCompleted(false), 4000);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="Close">
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ color: '#ffcc00', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Direct Download Gateway
          </div>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginTop: '4px', lineHeight: 1.3 }}>
            {movie.shortTitle} ({movie.year})
          </h2>
          <div style={{ display: 'inline-flex', gap: '8px', marginTop: '8px' }}>
            <span style={{ background: '#b21f2d', padding: '2px 8px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700 }}>
              {downloadTier.quality}
            </span>
            <span style={{ background: '#1f242d', border: '1px solid #3d4554', padding: '2px 8px', borderRadius: '3px', fontSize: '0.75rem', color: '#a0a6b1' }}>
              Size: {downloadTier.size}
            </span>
          </div>
        </div>

        {countdown > 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffeb3b' }}>
              {countdown}
            </div>
            <p style={{ color: '#a0a6b1', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Generating secure high-speed links...
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#4ade80', marginBottom: '0.75rem' }}>
              <ShieldCheck size={16} />
              <span>Verified Clean File • High Speed Direct Cloud Server Ready</span>
            </div>

            <div className="server-list">
              <button 
                className="server-btn"
                onClick={() => handleStartDownload('Fast Cloud Server')}
                disabled={downloading}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive size={18} style={{ color: '#2ecc71' }} />
                  Fast Cloud Direct [Unlimited Speed]
                </span>
                <span style={{ fontSize: '0.75rem', color: '#ffcc00', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  ⚡ FASTEST <ExternalLink size={12} />
                </span>
              </button>

              <button 
                className="server-btn"
                onClick={() => handleStartDownload('Google Drive High Speed')}
                disabled={downloading}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={18} style={{ color: '#3498db' }} />
                  Google Drive Direct [High Speed]
                </span>
                <span style={{ fontSize: '0.75rem', color: '#a0a6b1', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  G-Drive <ExternalLink size={12} />
                </span>
              </button>

              <button 
                className="server-btn"
                onClick={() => handleStartDownload('Mega.nz Cloud Mirror')}
                disabled={downloading}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={18} style={{ color: '#e74c3c' }} />
                  Mega.nz Direct Mirror
                </span>
                <span style={{ fontSize: '0.75rem', color: '#a0a6b1', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  Cloud <ExternalLink size={12} />
                </span>
              </button>

              <button 
                className="server-btn"
                onClick={() => handleStartDownload('Online Stream Player')}
                disabled={downloading}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={18} style={{ color: '#f39c12' }} />
                  Watch Online [Streaming Player]
                </span>
                <span style={{ fontSize: '0.75rem', color: '#ffcc00' }}>▶ PLAY</span>
              </button>
            </div>

            {downloading && (
              <div style={{ textAlign: 'center', marginTop: '1rem', color: '#ffeb3b', fontSize: '0.85rem' }}>
                Connecting to {downloading}... Launching download stream.
              </div>
            )}

            {completed && (
              <div style={{ textAlign: 'center', marginTop: '1rem', color: '#4ade80', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} />
                Download opened in new tab!
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem', borderTop: '1px solid #232731', paddingTop: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>
          Format: MKV • Audio: Dual Audio Hindi/Eng • Subtitles: Muxed English
        </div>
      </div>
    </div>
  );
}
