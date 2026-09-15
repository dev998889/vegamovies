import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
  quality: { type: String, required: true },
  size: { type: String, required: true },
  res: { type: String, default: '1080p' },
  badge: { type: String, default: 'HD' },
  link: { type: String, default: '#' } // Super Admin direct download URL
});

const commentSchema = new mongoose.Schema({
  author: { type: String, default: 'Anonymous' },
  date: { type: String },
  text: { type: String, required: true }
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortTitle: { type: String, required: true },
  year: { type: Number, default: 2026 },
  qualityTag: { type: String, default: 'WEB' },
  date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() },
  rating: { type: String, default: '7.5/10' },
  categories: { type: [String], default: ['Bollywood', 'Dual Audio'] },
  genres: { type: [String], default: ['Action', 'Drama'] },
  audio: { type: [String], default: ['Hindi (Original)'] },
  subtitle: { type: String, default: 'English Subtitles' },
  runtime: { type: String, default: '2h 10min' },
  director: { type: String, default: 'Unknown' },
  stars: { type: String, default: 'Various' },
  poster: { type: String, required: true },
  banner: { type: String },
  screenshots: { type: [String], default: [] },
  verifiedText: { type: String },
  storyline: { type: String, default: 'No storyline provided.' },
  downloads: [downloadSchema],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Movie = mongoose.model('Movie', movieSchema);
