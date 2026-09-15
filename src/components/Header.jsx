import React, { useState } from 'react';
import { Search, ChevronDown, Film, Home } from 'lucide-react';

export default function Header({ onSelectCategory, onSearch, currentCategory, onGoHome }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <header className="header-wrapper">
      {/* Golden Logo */}
      <div className="logo-container">
        <div 
          onClick={onGoHome} 
          className="vegamovies-logo"
          style={{ cursor: 'pointer' }}
          title="Vegamovies Official"
        >
          VEGAMOVIES
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <ul className="nav-links">
          <li 
            className={`nav-item ${currentCategory === 'ALL' ? 'active' : ''}`}
            onClick={onGoHome}
          >
            <Home size={14} style={{ marginRight: 2 }} />
            HOME
          </li>
          
          <li 
            className={`nav-item ${currentCategory === 'Bollywood' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Bollywood')}
          >
            Bollywood
            <span className="dropdown-arrow">▼</span>
            <div className="nav-dropdown">
              <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); onSelectCategory('Bollywood'); }}>All Bollywood</div>
              <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); onSelectCategory('Drama'); }}>Bollywood Drama</div>
              <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); onSelectCategory('Action'); }}>Bollywood Action</div>
            </div>
          </li>

          <li 
            className={`nav-item ${currentCategory === 'Hollywood' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Hollywood')}
          >
            Hollywood
            <span className="dropdown-arrow">▼</span>
            <div className="nav-dropdown">
              <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); onSelectCategory('Hollywood'); }}>Hollywood Hindi Dubbed</div>
              <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); onSelectCategory('English'); }}>Hollywood English</div>
            </div>
          </li>

          <li 
            className={`nav-item ${currentCategory === 'Dual Audio' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Dual Audio')}
          >
            <Film size={13} style={{ marginRight: 2 }} />
            Dual Audio
            <span className="dropdown-arrow">▼</span>
            <div className="nav-dropdown">
              <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); onSelectCategory('Dual Audio'); }}>Dual Audio [Hindi]</div>
              <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); onSelectCategory('South Hindi Dubbed'); }}>South Hindi Dubbed</div>
            </div>
          </li>

          <li 
            className={`nav-item ${currentCategory === 'Web Series' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Web Series')}
          >
            Tv Shows
          </li>

          <li 
            className={`nav-item ${currentCategory === 'Telugu' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Telugu')}
          >
            Telugu
          </li>

          <li 
            className={`nav-item ${currentCategory === 'Tamil' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Tamil')}
          >
            Tamil
          </li>

          <li className="nav-item">
            Genre
            <span className="dropdown-arrow">▼</span>
            <div className="nav-dropdown">
              {['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Mystery', 'Adventure', 'Romance'].map(g => (
                <div 
                  key={g} 
                  className="nav-dropdown-item"
                  onClick={(e) => { e.stopPropagation(); onSelectCategory(g); }}
                >
                  {g}
                </div>
              ))}
            </div>
          </li>

          <li className="nav-item">
            By Year
            <span className="dropdown-arrow">▼</span>
            <div className="nav-dropdown">
              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'].map(y => (
                <div 
                  key={y} 
                  className="nav-dropdown-item"
                  onClick={(e) => { e.stopPropagation(); onSelectCategory(y); }}
                >
                  {y} Movies
                </div>
              ))}
            </div>
          </li>
        </ul>

        {/* Live Search */}
        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
          />
          <button type="submit" title="Search">
            <Search size={15} />
          </button>
        </form>
      </nav>
    </header>
  );
}
