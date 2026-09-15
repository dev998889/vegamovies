import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import ImageKit from 'imagekit';
import { Movie } from './models/Movie.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer memory storage for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ImageKit Instance
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Admin Passkey Verification Middleware
const verifyAdmin = (req, res, next) => {
  const token = req.headers['x-admin-key'];
  if (token && token === process.env.ADMIN_SECRET_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid Admin Key' });
  }
};

// Admin Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { passkey } = req.body;
  if (passkey === process.env.ADMIN_SECRET_KEY) {
    return res.json({ success: true, token: process.env.ADMIN_SECRET_KEY });
  }
  return res.status(401).json({ success: false, error: 'Incorrect Passkey' });
});

// ImageKit Direct Upload Endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const fileName = `vegamovie_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const result = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: fileName,
      folder: '/vegamovies_posters'
    });

    res.json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      name: result.name
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({ error: error.message || 'ImageKit upload failed' });
  }
});

// Movies Endpoints
app.get('/api/movies', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortTitle: { $regex: search, $options: 'i' } },
        { genres: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'ALL') {
      query.$or = query.$or || [];
      query.$or.push(
        { categories: { $regex: category, $options: 'i' } },
        { genres: { $regex: category, $options: 'i' } },
        { audio: { $regex: category, $options: 'i' } }
      );
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get Single Movie
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// Create Movie (Super Admin)
app.post('/api/movies', verifyAdmin, async (req, res) => {
  try {
    const movieData = req.body;
    if (!movieData.title || !movieData.poster) {
      return res.status(400).json({ error: 'Title and Poster are required' });
    }

    // Default download tiers if none provided
    if (!movieData.downloads || movieData.downloads.length === 0) {
      movieData.downloads = [
        { quality: '480p x264', size: '350MB', res: '854x480', badge: 'SD', link: '#' },
        { quality: '720p HEVC x265', size: '750MB', res: '1280x720', badge: 'HD HEVC', link: '#' },
        { quality: '1080p x264', size: '2.5GB', res: '1920x1080', badge: 'FHD', link: '#' }
      ];
    }

    const movie = new Movie(movieData);
    await movie.save();
    res.status(201).json({ success: true, movie });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ error: error.message || 'Failed to create movie' });
  }
});

// Update Movie (Super Admin)
app.put('/api/movies/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Movie not found' });
    res.json({ success: true, movie: updated });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update movie' });
  }
});

// Delete Movie (Super Admin)
app.delete('/api/movies/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Movie not found' });
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Add Comment to Movie
app.post('/api/movies/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const newComment = {
      author: author || 'Anonymous User',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      text
    };

    movie.comments.push(newComment);
    await movie.save();
    res.json({ success: true, comments: movie.comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// MongoDB Connection & Initial Seed
async function startServer() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas (vegamovies)');

    // Check if initial seeding needed
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log('Database empty! Seeding initial movies from catalog...');
      const seedMovies = [
        {
          title: 'Kota aka Hen 2026 Hindi - Greek Dual Audio [WEB DL]',
          shortTitle: 'Kota aka Hen',
          year: 2026,
          qualityTag: 'WEB',
          rating: '7.4/10',
          categories: ['Dual Audio', 'Drama', 'Adventure', 'Hollywood'],
          genres: ['Adventure', 'Drama', 'Mystery'],
          audio: ['Hindi (Cleaned)', 'Greek (Original)'],
          subtitle: 'English [Muxed]',
          runtime: '1h 48min',
          director: 'Pálfi György',
          stars: 'Tamás Polgár, Hermina Fátyol, Csaba Czene',
          poster: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&auto=format&fit=crop&q=80',
          storyline: 'An eccentric countryside journey unfolds when a resilient small-town villager discovers unexpected bonds through an ancestral fowl companion, spiraling into a high-stakes adventure.',
          downloads: [
            { quality: '480p x264', size: '287MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
            { quality: '720p HEVC x265', size: '662MB', res: '1280x720 [10Bit]', badge: 'HD HEVC', link: 'https://drive.google.com' },
            { quality: '720p x264', size: '1.11GB', res: '1280x720', badge: 'HD', link: 'https://drive.google.com' },
            { quality: '1080p HEVC x265', size: '1.91GB', res: '1920x1080 [10Bit]', badge: 'FHD HEVC', link: 'https://drive.google.com' },
            { quality: '1080p x264', size: '3.13GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
          ]
        },
        {
          title: 'The End of Oak Street 2026 English Audio [WEB DL]',
          shortTitle: 'The End of Oak Street',
          year: 2026,
          qualityTag: 'WEB',
          rating: '6.9/10',
          categories: ['Hollywood', 'Thriller', 'Mystery'],
          genres: ['Mystery', 'Thriller'],
          audio: ['English [Original 5.1 DD]'],
          subtitle: 'English [ESub]',
          runtime: '1h 52min',
          director: 'Marcus Vane',
          stars: 'Rachel McAdams, Daniel Craig, Ethan Hawke',
          poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
          storyline: 'A quiet suburban street faces an ominous revelation when consecutive families vanish overnight without leaving behind a single trace.',
          downloads: [
            { quality: '480p x264', size: '320MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
            { quality: '720p HEVC x265', size: '710MB', res: '1280x720', badge: 'HD HEVC', link: 'https://drive.google.com' },
            { quality: '1080p x264', size: '2.45GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
          ]
        },
        {
          title: 'Kankvanni 2026 Punjabi Dual Audio [WEB DL]',
          shortTitle: 'Kankvanni',
          year: 2026,
          qualityTag: 'WEB',
          rating: '8.1/10',
          categories: ['Punjabi', 'Drama', 'Family'],
          genres: ['Family', 'Drama', 'Romance'],
          audio: ['Punjabi (Original)', 'Hindi (Dubbed)'],
          subtitle: 'English',
          runtime: '2h 10min',
          director: 'Amritpal Singh',
          stars: 'Ammy Virk, Sonam Bajwa, Binnu Dhillon',
          poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          storyline: 'A heartwarming story set across rural Punjab depicting ancestral legacy, golden wheat fields, and a family fighting for their land.',
          downloads: [
            { quality: '480p x264', size: '390MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
            { quality: '720p HEVC x265', size: '820MB', res: '1280x720', badge: 'HD HEVC', link: 'https://drive.google.com' },
            { quality: '1080p x264', size: '2.80GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
          ]
        },
        {
          title: 'Sirf Ek Bandaa Kaafi Hai 2023 Hindi Dual Audio [WEB DL]',
          shortTitle: 'Sirf Ek Bandaa Kaafi Hai',
          year: 2023,
          qualityTag: 'WEB',
          rating: '8.0/10',
          categories: ['Bollywood', 'Drama', 'Crime'],
          genres: ['Drama', 'Crime', 'Biography'],
          audio: ['Hindi [Original DD 5.1]'],
          poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
          storyline: 'An ordinary session court lawyer single-handedly fights an extraordinary battle against a powerful godman.',
          downloads: [
            { quality: '480p x264', size: '400MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
            { quality: '720p x264', size: '1.40GB', res: '1280x720', badge: 'HD', link: 'https://drive.google.com' },
            { quality: '1080p x264', size: '2.95GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
          ]
        },
        {
          title: 'Munde Jattan De Balaunde Bakre 2026 Punjabi Audio [WEB DL]',
          shortTitle: 'Munde Jattan De Balaunde Bakre',
          year: 2026,
          qualityTag: 'WEB',
          rating: '7.2/10',
          categories: ['Punjabi', 'Comedy', 'Action'],
          genres: ['Comedy', 'Action', 'Drama'],
          audio: ['Punjabi Original Audio'],
          poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80',
          storyline: 'Three mischievous cousins head to a village wedding where hilarious misunderstandings lead to a full-blown rivalry.',
          downloads: [
            { quality: '480p x264', size: '360MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
            { quality: '1080p x264', size: '2.70GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
          ]
        },
        {
          title: 'ABCD aka Any Body Can Dance 2013 Hindi Dual Audio [WEB DL]',
          shortTitle: 'ABCD Any Body Can Dance',
          year: 2013,
          qualityTag: 'WEB',
          rating: '6.5/10',
          categories: ['Bollywood', 'Drama'],
          genres: ['Drama', 'Music'],
          audio: ['Hindi Original'],
          poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
          storyline: 'When a capable dancer is kicked out of his dance academy, he finds raw talent among street youth.',
          downloads: [
            { quality: '480p x264', size: '420MB', res: '854x480', badge: 'SD', link: 'https://drive.google.com' },
            { quality: '1080p x264', size: '2.85GB', res: '1920x1080', badge: 'FHD', link: 'https://drive.google.com' }
          ]
        }
      ];

      await Movie.insertMany(seedMovies);
      console.log(`✅ Seeded ${seedMovies.length} initial movies into MongoDB!`);
    } else {
      console.log(`Database already has ${count} movies.`);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Vegamovies Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection or server startup error:', err);
  }
}

startServer();
