import React, { useState } from 'react';
import { Calendar, Download, Zap, Film, Star, ArrowLeft, Send } from 'lucide-react';
import { RECENT_POSTS } from '../data/movies';
import AdSlot from './AdSlot';

export default function MovieDetail({ movie, onBack, onSelectRecentMovie, onDownloadClick }) {
  const [comments, setComments] = useState(movie.comments || []);
  const [nameInput, setNameInput] = useState('');
  const [commentInput, setCommentInput] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      author: nameInput.trim() || 'Anonymous User',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      text: commentInput.trim(),
    };
    setComments([...comments, newComment]);
    setCommentInput('');
    setNameInput('');
  };

  return (
    <div className="detail-layout">
      {/* Main Movie Content */}
      <article className="detail-main">
        {/* Back navigation button */}
        <button 
          onClick={onBack}
          style={{
            background: '#1a1d24',
            border: '1px solid #2f3440',
            color: '#ffcc00',
            padding: '6px 14px',
            borderRadius: '4px',
            marginBottom: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={14} /> Back to Movies
        </button>

        {/* Title */}
        <h1 className="detail-header-title">{movie.title}</h1>

        {/* Date metadata */}
        <div className="detail-date-badge">
          <Calendar size={13} style={{ color: '#ffcc00' }} />
          {movie.date}
        </div>

        {/* Verified Notice Box with Yellow Highlights */}
        <div className="verified-box">
          <p>
            <span style={{ fontSize: '1rem', marginRight: '4px' }}>✅</span>
            <strong>Download {movie.shortTitle} ({movie.year}) WEB DL Full Movie</strong>{' '}
            {movie.downloads?.map(d => d.size).join(' - ')} Qualities. This is a{' '}
            <span className="highlight-yellow">100MB Hindi Dubbed Movies HEVC Mkv</span>,{' '}
            <span className="highlight-yellow">300mb Movies Dubbed in Hindi</span>,{' '}
            <span className="highlight-yellow">South Indian Dubbed Movies 300MB</span>,{' '}
            South Indian Dubbed Movies Download,{' '}
            <span className="highlight-yellow">{movie.genres?.join(', ')}</span> Movie and Available in{' '}
            <span className="highlight-red">{movie.audio?.join(' - ')}</span> in{' '}
            {movie.downloads?.map(d => d.size).join(' - ')} in MKV Format. This is one of the best movie based on{' '}
            <span className="highlight-yellow">{movie.genres?.[0] || 'Adventure'}, {movie.genres?.[1] || 'Drama'}</span>.{' '}
            This Movie Is Now Available.{' '}
            <span className="highlight-yellow">Download Now!</span>
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            <span className="highlight-yellow">Vegamovies</span> is the best online platform for downloading{' '}
            <strong>100MB Hindi Dubbed Movies HEVC Mkv</strong>, <strong>300mb Movies Dubbed in Hindi</strong>,{' '}
            South Indian Dubbed Movies 300MB, South Indian Dubbed Movies Download, Adventure, Drama. We provide direct G-Drive download link for fast and secure downloading. Click on the download button below and follow the steps to start download.
          </p>
        </div>

        {/* Movie Poster Centered */}
        <div className="detail-poster-container">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="detail-poster-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Technical Movie Information */}
        <table className="specs-table">
          <tbody>
            <tr>
              <td>Full Name:</td>
              <td>{movie.title}</td>
            </tr>
            <tr>
              <td>IMDb Rating:</td>
              <td>
                <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>★ {movie.rating}</span>
              </td>
            </tr>
            <tr>
              <td>Release Year:</td>
              <td>{movie.year}</td>
            </tr>
            <tr>
              <td>Language:</td>
              <td>{movie.audio?.join(', ')}</td>
            </tr>
            <tr>
              <td>Subtitles:</td>
              <td>{movie.subtitle || 'English Subtitles'}</td>
            </tr>
            <tr>
              <td>Runtime:</td>
              <td>{movie.runtime || '2 hours'}</td>
            </tr>
            <tr>
              <td>Genres:</td>
              <td>{movie.genres?.join(', ')}</td>
            </tr>
            <tr>
              <td>Director:</td>
              <td>{movie.director}</td>
            </tr>
            <tr>
              <td>Star Cast:</td>
              <td>{movie.stars}</td>
            </tr>
            <tr>
              <td>Storyline:</td>
              <td>{movie.storyline}</td>
            </tr>
          </tbody>
        </table>

        {/* Screenshots Preview */}
        {movie.screenshots && movie.screenshots.length > 0 && (
          <div className="screenshots-section">
            <div className="section-tagline">: SCREENSHOTS :</div>
            <div className="screenshot-grid">
              {movie.screenshots.map((shot, idx) => (
                <div key={idx} className="screenshot-item">
                  <img src={shot} alt={`Screenshot ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsored Ad Slot */}
        <AdSlot />

        {/* Download Links Section (Matches Image 1 Exactly!) */}
        <section className="download-section-box" id="download-links">
          <div className="download-title-divider">
            — — = = Download Links = = — —
          </div>

          {movie.downloads?.map((dl, index) => (
            <div key={index} className="download-tier">
              <div className="quality-heading">{dl.quality}</div>
              <button 
                className="dl-glow-button"
                onClick={() => onDownloadClick(movie, dl)}
              >
                <Download size={16} />
                <Zap size={14} style={{ color: '#ffeb3b' }} />
                <span>CLICK HERE TO DOWNLOAD [{dl.size}]</span>
                <Zap size={14} style={{ color: '#ffeb3b' }} />
                <Download size={16} />
              </button>
            </div>
          ))}
        </section>

        {/* Comments Section */}
        <section className="comments-section">
          <h3 className="comments-title">
            {comments.length} THOUGHTS ON "{movie.shortTitle.toUpperCase()} {movie.year} HINDI - GREEK DUAL AUDIO"
          </h3>

          {comments.map((c, i) => (
            <div key={i} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">{c.author}</span>
                <span className="comment-date">{c.date}</span>
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}

          {/* Leave a reply form */}
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <div style={{ color: '#ffcc00', fontWeight: '700', fontSize: '0.95rem' }}>
              Leave a Reply
            </div>
            <p style={{ fontSize: '0.78rem', color: '#888' }}>
              Your email address will not be published. Required fields are marked *
            </p>
            <div className="comment-input-row">
              <input
                type="text"
                placeholder="Name *"
                className="form-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email *"
                className="form-input"
                required
              />
            </div>
            <textarea
              rows={4}
              placeholder="Comment *"
              className="form-textarea"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="post-comment-btn">
              POST COMMENT
            </button>
          </form>
        </section>
      </article>

      {/* Right Sidebar Recent Posts (Matches Screenshot 3) */}
      <aside className="sidebar-container">
        <h3 className="sidebar-title">RECENT POSTS</h3>
        <ul className="recent-posts-list">
          {RECENT_POSTS.map((post) => (
            <li 
              key={post.id} 
              className="recent-post-item"
              onClick={() => onSelectRecentMovie(post.id)}
            >
              <span className="recent-post-bullet">◆</span>
              <span>{post.title}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
