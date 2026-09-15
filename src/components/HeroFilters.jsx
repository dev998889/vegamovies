import React from 'react';
import { Share2, MessageCircle, Send, Check } from 'lucide-react';
import { HERO_TAGS, CATEGORIES } from '../data/movies';

export default function HeroFilters({ activeCategory, onSelectCategory }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hero-filters-section">
      {/* 4 Big Color Pills */}
      <div className="hero-pills">
        {HERO_TAGS.map((tag) => (
          <button
            key={tag.label}
            className={`hero-pill-btn ${tag.color}`}
            onClick={() => onSelectCategory(tag.filter)}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Red Category Pills Cloud */}
      <div className="category-cloud">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${activeCategory?.toUpperCase() === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Welcome SEO Notice Box */}
      <div className="welcome-card">
        <h2 className="welcome-title">
          Welcome to <span>Vegamovies Official</span> – latest Bollywood Movies, Hollywood Hindi Dubbed, South Indian Hindi, Dual Audio Movies, Web Series, 300MB Movies, 480p 720p 1080p HEVC x265, 4K WEB-DL &amp; HDRip collections updated daily. Vegamovies HD, Vegamovies Movies Download, Vegamovies Web Series, Moviesflix, Filmyzilla, Filmy4wap, Filmyfly, Bollyflix, Filmy4web, 9xflix, Mp4Moviez index style updates.
        </h2>

        <p className="welcome-subtitle">
          Browse updated categories including Bollywood 2025–2026 releases, South Indian Hindi Dubbed (Telugu, Tamil, Malayalam, Kannada), Hollywood Dual Audio, Anime, Cartoon, Korean Drama, Action, Sci-Fi, Thriller, Romance, Horror &amp; complete OTT collections from Netflix, Prime Video, Disney+ Hotstar, Zee5 &amp; more.
        </p>

        {/* Social Share Buttons */}
        <div className="social-share-row">
          <button className="share-btn share-fb" onClick={() => window.open('https://facebook.com', '_blank')}>
            f Share
          </button>
          <button className="share-btn share-x" onClick={() => window.open('https://twitter.com', '_blank')}>
            𝕏 Post
          </button>
          <button className="share-btn share-wa" onClick={() => window.open('https://whatsapp.com', '_blank')}>
            <MessageCircle size={14} />
            Share
          </button>
          <button className="share-btn share-link" onClick={handleCopyLink}>
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button className="share-btn share-tg" onClick={() => window.open('https://telegram.org', '_blank')}>
            <Send size={14} />
            Share
          </button>
        </div>

        {/* Bottom Disclaimer Tags */}
        <div className="seo-tags-box">
          Vegamovies, Vegamovies HD, Vegamovies 2026, Vegamovies Movies, Vegamovies Bollywood, Vegamovies South Hindi Dubbed, Dual Audio Movies, 300MB 480p 720p 1080p HEVC x264 x265 WEB-DL, Filmyfly HD, HdMovies4u, Filmyzilla, Filmy4wep, Bollyflix, Filmy4web, Moviesflix, 9xFlix, Mp4Moviez, Vegamovies Web Series.
        </div>
      </div>
    </div>
  );
}
