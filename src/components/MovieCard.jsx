import React from 'react';

export default function MovieCard({ movie, onSelectMovie }) {
  return (
    <div className="movie-card" onClick={() => onSelectMovie(movie)}>
      <div className="movie-poster-box">
        {movie.qualityTag && (
          <span className="quality-badge">{movie.qualityTag}</span>
        )}
        <img
          src={movie.poster}
          alt={movie.title}
          className="movie-poster-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </div>
      <h3 className="movie-card-title" title={movie.title}>
        {movie.title}
      </h3>
    </div>
  );
}
