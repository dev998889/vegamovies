import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Link as LinkIcon, 
  Film,
  Lock,
  RefreshCw
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function AdminPanel({ onClose, onMovieAdded }) {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [moviesList, setMoviesList] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    year: 2026,
    qualityTag: 'WEB',
    rating: '7.5/10',
    categories: 'Bollywood, Dual Audio',
    genres: 'Action, Drama',
    audio: 'Hindi (Original)',
    subtitle: 'English Subtitles',
    runtime: '2h 15min',
    director: '',
    stars: '',
    poster: '',
    storyline: '',
    downloads: [
      { quality: '480p x264', size: '350MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
      { quality: '720p HEVC x265', size: '750MB', res: '1280x720 [10Bit]', badge: 'HD HEVC', link: 'https://drive.google.com' },
      { quality: '1080p x264', size: '2.50GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
    ]
  });

  const [feedback, setFeedback] = useState(null);

  // Check saved passkey
  useEffect(() => {
    const saved = localStorage.getItem('vegamovies_admin_token');
    if (saved) {
      setIsAuthenticated(true);
      fetchAdminMovies();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === 'vega@superadmin2026') {
      localStorage.setItem('vegamovies_admin_token', passkey);
      setIsAuthenticated(true);
      setAuthError('');
      fetchAdminMovies();
    } else {
      setAuthError('Invalid Admin Passkey. Access Denied.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vegamovies_admin_token');
    setIsAuthenticated(false);
    setPasskey('');
  };

  const fetchAdminMovies = async () => {
    try {
      const res = await fetch(`${API_BASE}/movies`);
      if (res.ok) {
        const data = await res.json();
        setMoviesList(data);
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    }
  };

  // ImageKit file upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, poster: data.url }));
        setImagePreview(data.url);
        setFeedback({ type: 'success', message: 'Poster uploaded to ImageKit successfully!' });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Upload failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to upload image to ImageKit' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Download tiers manipulation
  const handleAddTier = () => {
    setFormData(prev => ({
      ...prev,
      downloads: [
        ...prev.downloads,
        { quality: '720p x264', size: '1.2GB', res: '1280x720', badge: 'HD', link: 'https://drive.google.com' }
      ]
    }));
  };

  const handleRemoveTier = (idx) => {
    setFormData(prev => ({
      ...prev,
      downloads: prev.downloads.filter((_, i) => i !== idx)
    }));
  };

  const handleTierChange = (idx, field, val) => {
    const updated = [...formData.downloads];
    updated[idx][field] = val;
    setFormData(prev => ({ ...prev, downloads: updated }));
  };

  // Form submit
  const handleSubmitMovie = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.poster) {
      setFeedback({ type: 'error', message: 'Title and Poster Image are required!' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('vegamovies_admin_token') || 'vega@superadmin2026';
      const payload = {
        ...formData,
        shortTitle: formData.shortTitle || formData.title.split(' ')[0],
        categories: formData.categories.split(',').map(s => s.trim()),
        genres: formData.genres.split(',').map(s => s.trim()),
        audio: formData.audio.split(',').map(s => s.trim())
      };

      const res = await fetch(`${API_BASE}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': token
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `"${data.movie.title}" added to MongoDB successfully!` });
        fetchAdminMovies();
        if (onMovieAdded) onMovieAdded(data.movie);
        // reset form
        setFormData({
          title: '',
          shortTitle: '',
          year: 2026,
          qualityTag: 'WEB',
          rating: '7.5/10',
          categories: 'Bollywood, Dual Audio',
          genres: 'Action, Drama',
          audio: 'Hindi (Original)',
          subtitle: 'English Subtitles',
          runtime: '2h 15min',
          director: '',
          stars: '',
          poster: '',
          storyline: '',
          downloads: [
            { quality: '480p x264', size: '350MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
            { quality: '720p HEVC x265', size: '750MB', res: '1280x720 [10Bit]', badge: 'HD HEVC', link: 'https://drive.google.com' },
            { quality: '1080p x264', size: '2.50GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
          ]
        });
        setImagePreview('');
      } else {
        setFeedback({ type: 'error', message: data.error || 'Could not save movie' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Server connection error' });
    } finally {
      setLoading(false);
    }
  };

  // Delete movie
  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from MongoDB?`)) return;
    try {
      const token = localStorage.getItem('vegamovies_admin_token') || 'vega@superadmin2026';
      const res = await fetch(`${API_BASE}/movies/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': token }
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: `Deleted "${title}" successfully.` });
        fetchAdminMovies();
        if (onMovieAdded) onMovieAdded();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to delete movie' });
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, overflowY: 'auto' }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '900px', 
          width: '95%', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          margin: '2rem auto',
          background: '#0e1013',
          border: '2px solid #e5a93b'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #232731', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} style={{ color: '#e5a93b' }} />
            <h2 style={{ fontSize: '1.25rem', color: '#ffcc00', letterSpacing: '0.5px' }}>
              VEGAMOVIES HIDDEN SUPER ADMIN
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: '#888' }} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div style={{
            background: feedback.type === 'success' ? '#143820' : '#45171a',
            border: `1px solid ${feedback.type === 'success' ? '#2ecc71' : '#e74c3c'}`,
            color: '#fff',
            padding: '0.65rem 1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Passkey Gate if not authenticated */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <Lock size={42} style={{ color: '#e5a93b', marginBottom: '1rem' }} />
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Restricted Super Admin Area
            </h3>
            <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Enter your master administrative passkey to manage database movies &amp; upload posters.
            </p>

            <div style={{ maxWidth: '340px', margin: '0 auto', display: 'flex', gap: '8px' }}>
              <input 
                type="password" 
                placeholder="Admin Passkey..." 
                className="form-input" 
                style={{ flex: 1 }}
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                style={{
                  background: '#e5a93b',
                  color: '#000',
                  fontWeight: 700,
                  padding: '0 1rem',
                  borderRadius: '4px'
                }}
              >
                UNLOCK
              </button>
            </div>

            {authError && (
              <div style={{ color: '#ff4757', fontSize: '0.82rem', marginTop: '0.75rem' }}>
                {authError}
              </div>
            )}
          </form>
        ) : (
          /* Super Admin Dashboard */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', background: '#161920', padding: '0.75rem 1rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.82rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} /> Connected to <strong>MongoDB Atlas (vegamovies)</strong> &amp; <strong>ImageKit CDN</strong>
              </div>
              <button 
                onClick={handleLogout}
                style={{ background: '#252932', color: '#ff6b6b', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '3px' }}
              >
                Logout Admin
              </button>
            </div>

            {/* Add New Movie Form */}
            <form onSubmit={handleSubmitMovie} style={{ background: '#121418', border: '1px solid #262a34', borderRadius: '6px', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ color: '#ffcc00', fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                + Add New Movie with Download Links
              </div>

              {/* Title & Short Title */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Full Movie Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. Devara Part 1 2026 Hindi Dual Audio [WEB DL]"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Short Title</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. Devara Part 1"
                    value={formData.shortTitle}
                    onChange={e => setFormData({ ...formData, shortTitle: e.target.value })}
                  />
                </div>
              </div>

              {/* ImageKit Direct Poster Upload */}
              <div style={{ marginBottom: '1rem', background: '#191c24', padding: '0.85rem', borderRadius: '4px', border: '1px dashed #3f4757' }}>
                <label style={{ fontSize: '0.82rem', color: '#ffcc00', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Upload size={15} /> Upload Movie Poster to ImageKit CDN *
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ fontSize: '0.82rem', color: '#aaa' }}
                  />

                  {uploadingImage && (
                    <span style={{ fontSize: '0.8rem', color: '#ffcc00', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RefreshCw size={13} className="spin" /> Uploading to ImageKit...
                    </span>
                  )}

                  {formData.poster && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={formData.poster} 
                        alt="Preview" 
                        style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '3px', border: '1px solid #e5a93b' }} 
                      />
                      <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>ImageKit Hosted ✓</span>
                    </div>
                  )}
                </div>

                {/* Or Direct Image URL fallback */}
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.78rem' }}
                    placeholder="Or enter direct Image URL here..."
                    value={formData.poster}
                    onChange={e => setFormData({ ...formData, poster: e.target.value })}
                  />
                </div>
              </div>

              {/* Year, Quality Tag, Rating */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Year</label>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '100%' }}
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Quality Badge</label>
                  <select
                    className="form-input"
                    style={{ width: '100%' }}
                    value={formData.qualityTag}
                    onChange={e => setFormData({ ...formData, qualityTag: e.target.value })}
                  >
                    <option value="WEB">WEB</option>
                    <option value="WEBRip">WEBRip</option>
                    <option value="HDTC">HDTC</option>
                    <option value="BluRay">BluRay</option>
                    <option value="HDRip">HDRip</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>IMDb Rating</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. 7.8/10"
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
              </div>

              {/* Categories & Genres */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Categories (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="Bollywood, Dual Audio, Hollywood"
                    value={formData.categories}
                    onChange={e => setFormData({ ...formData, categories: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Genres (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="Action, Thriller, Drama"
                    value={formData.genres}
                    onChange={e => setFormData({ ...formData, genres: e.target.value })}
                  />
                </div>
              </div>

              {/* Audio & Cast */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Audio Tracks</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="Hindi (Original), English"
                    value={formData.audio}
                    onChange={e => setFormData({ ...formData, audio: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Star Cast</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="Lead actors..."
                    value={formData.stars}
                    onChange={e => setFormData({ ...formData, stars: e.target.value })}
                  />
                </div>
              </div>

              {/* Storyline */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '3px' }}>Storyline / Synopsis</label>
                <textarea
                  className="form-textarea"
                  style={{ width: '100%' }}
                  rows={2}
                  placeholder="Brief movie synopsis..."
                  value={formData.storyline}
                  onChange={e => setFormData({ ...formData, storyline: e.target.value })}
                ></textarea>
              </div>

              {/* Dynamic Download Links Builder */}
              <div style={{ background: '#161922', padding: '0.85rem', borderRadius: '4px', marginBottom: '1.25rem', border: '1px solid #2d3342' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffeb3b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LinkIcon size={14} /> Configure Download Links &amp; Servers
                  </span>
                  <button
                    type="button"
                    onClick={handleAddTier}
                    style={{ background: '#2563eb', color: '#fff', fontSize: '0.72rem', padding: '3px 8px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={12} /> Add Quality Tier
                  </button>
                </div>

                {formData.downloads.map((tier, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '130px 100px 1fr 30px', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                    <input
                      type="text"
                      placeholder="Quality (480p x264)"
                      className="form-input"
                      style={{ fontSize: '0.75rem' }}
                      value={tier.quality}
                      onChange={e => handleTierChange(idx, 'quality', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Size (350MB)"
                      className="form-input"
                      style={{ fontSize: '0.75rem' }}
                      value={tier.size}
                      onChange={e => handleTierChange(idx, 'size', e.target.value)}
                    />
                    <input
                      type="url"
                      placeholder="Direct Download URL (e.g. Google Drive, Mega link)"
                      className="form-input"
                      style={{ fontSize: '0.75rem' }}
                      value={tier.link}
                      onChange={e => handleTierChange(idx, 'link', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      style={{ background: 'transparent', color: '#ff4757', display: 'flex', justifyContent: 'center' }}
                      title="Remove tier"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(90deg, #27ae60 0%, #2ecc71 100%)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? <RefreshCw size={16} className="spin" /> : <Plus size={16} />}
                {loading ? 'SAVING TO MONGODB...' : 'PUBLISH MOVIE TO VEGAMOVIES'}
              </button>
            </form>

            {/* Live MongoDB Movies Table */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', textTransform: 'uppercase' }}>
                  Movies in Database ({moviesList.length})
                </h4>
                <button
                  onClick={fetchAdminMovies}
                  style={{ background: '#1c1f26', color: '#aaa', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '3px' }}
                >
                  Refresh List
                </button>
              </div>

              <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #232731', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#15181e', color: '#888', textAlign: 'left' }}>
                      <th style={{ padding: '6px 8px' }}>Poster</th>
                      <th style={{ padding: '6px 8px' }}>Title</th>
                      <th style={{ padding: '6px 8px' }}>Year</th>
                      <th style={{ padding: '6px 8px' }}>Links</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moviesList.map(m => (
                      <tr key={m._id} style={{ borderBottom: '1px solid #1f232c' }}>
                        <td style={{ padding: '6px 8px' }}>
                          <img src={m.poster} alt="" style={{ width: '30px', height: '42px', objectFit: 'cover', borderRadius: '2px' }} />
                        </td>
                        <td style={{ padding: '6px 8px', color: '#fff', fontWeight: 600 }}>{m.title}</td>
                        <td style={{ padding: '6px 8px', color: '#aaa' }}>{m.year}</td>
                        <td style={{ padding: '6px 8px', color: '#ffcc00' }}>{m.downloads?.length || 0} Qualities</td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteMovie(m._id, m.title)}
                            style={{ background: 'transparent', color: '#ff4757' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
