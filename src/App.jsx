import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import HeroFilters from './components/HeroFilters';
import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';
import DownloadModal from './components/DownloadModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import AdSlot from './components/AdSlot';
import { MOVIES as FALLBACK_MOVIES } from './data/movies';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [movies, setMovies] = useState(FALLBACK_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadTier, setDownloadTier] = useState(null);
  const [modalMovie, setModalMovie] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Fetch real-time movies from MongoDB Backend
  const loadMoviesFromDb = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/movies`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Normalize _id to id for seamless UI compatibility
          const normalized = data.map(m => ({
            ...m,
            id: m._id || m.id
          }));
          setMovies(normalized);
        }
      }
    } catch (err) {
      console.log('MongoDB server offline, using static mock data:', err);
    }
  }, []);

  useEffect(() => {
    loadMoviesFromDb();
  }, [loadMoviesFromDb]);

  // Secret keyboard shortcut: Ctrl + Shift + A to open Hidden Super Admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter movies based on category and search
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Search matching
      const matchesSearch = searchQuery.trim() === '' || 
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.shortTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres?.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.year?.toString().includes(searchQuery);

      if (!matchesSearch) return false;

      // Category matching
      if (activeCategory === 'ALL') return true;

      const normCat = activeCategory.toLowerCase();
      const hasCat = movie.categories?.some(c => c.toLowerCase().includes(normCat) || normCat.includes(c.toLowerCase()));
      const hasGenre = movie.genres?.some(g => g.toLowerCase().includes(normCat));
      const hasAudio = movie.audio?.some(a => a.toLowerCase().includes(normCat));
      const hasYear = movie.year?.toString() === activeCategory;

      return hasCat || hasGenre || hasAudio || hasYear;
    });
  }, [movies, activeCategory, searchQuery]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecentMovie = (movieId) => {
    const found = movies.find((m) => (m.id === movieId || m._id === movieId));
    if (found) {
      setSelectedMovie(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    setSelectedMovie(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (selectedMovie) {
      setSelectedMovie(null);
    }
  };

  const handleGoHome = () => {
    setSelectedMovie(null);
    setActiveCategory('ALL');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Secret: click logo 3 times to open admin
    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setShowAdmin(true);
        return 0;
      }
      return next;
    });
  };

  const handleDownloadClick = (movie, dl) => {
    setModalMovie(movie);
    setDownloadTier(dl);
  };

  return (
    <div className="app-root">
      {/* Header */}
      <Header
        currentCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onSearch={handleSearch}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="site-container">
        {/* If viewing a single movie detail */}
        {selectedMovie ? (
          <MovieDetail
            movie={selectedMovie}
            onBack={handleGoHome}
            onSelectRecentMovie={handleSelectRecentMovie}
            onDownloadClick={handleDownloadClick}
          />
        ) : (
          <>
            {/* Top Hero Pills & Welcome SEO Notice */}
            <HeroFilters
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Sponsored Ad Slot */}
            <AdSlot />

            {/* Section Heading or Search Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              borderBottom: '1px solid #232730',
              paddingBottom: '0.5rem'
            }}>
              <h2 style={{
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '0.6px'
              }}>
                {searchQuery 
                  ? `Search Results for: "${searchQuery}"` 
                  : activeCategory === 'ALL' 
                    ? 'Latest Uploads' 
                    : `${activeCategory} Movies`}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#a0a6b1' }}>
                  Showing {filteredMovies.length} movies
                </span>
                {/* Subtle Secret Admin Trigger Button */}
                <button
                  onClick={() => setShowAdmin(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #262a34',
                    color: '#666',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                  title="Super Admin (Ctrl+Shift+A)"
                >
                  ⚙
                </button>
              </div>
            </div>

            {/* Movie Catalog Grid */}
            {filteredMovies.length > 0 ? (
              <div className="catalog-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id || movie._id}
                    movie={movie}
                    onSelectMovie={handleSelectMovie}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                background: '#121418',
                borderRadius: '6px',
                border: '1px solid #252932',
                color: '#a0a6b1'
              }}>
                <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>
                  No movies found matching your selection.
                </p>
                <button
                  onClick={handleGoHome}
                  style={{
                    background: '#b21f2d',
                    color: '#fff',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    marginTop: '0.5rem'
                  }}
                >
                  View All Movies
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Download Server Popup Modal */}
      {downloadTier && modalMovie && (
        <DownloadModal
          movie={modalMovie}
          downloadTier={downloadTier}
          onClose={() => {
            setDownloadTier(null);
            setModalMovie(null);
          }}
        />
      )}

      {/* Hidden Super Admin Panel */}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onMovieAdded={() => loadMoviesFromDb()}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onGoHome={handleGoHome}
      />
    </div>
  );
}
