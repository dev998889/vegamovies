# vegamovies

A full-stack replica of the **Vegamovies** movie discovery & direct download platform built with **React 19**, **Node.js/Express**, **MongoDB Atlas**, and **ImageKit CDN**.

## 🌟 Key Features
- **Authentic Vegamovies Design**: Metallic golden logo, dark aesthetic, category capsules, and gold-bordered movie cards.
- **Movie Catalog & Filtering**: Search by title/genre/year, filter by categories (Bollywood, Dual Audio, Hollywood, Punjabi, etc.).
- **Detailed Movie View**: Verified quality specs, technical info, screenshots, and custom download links (`480p`, `720p`, `1080p`).
- **Hidden Super Admin Panel**:
  - Shortcut: `Ctrl + Shift + A`
  - Upload movie posters directly to **ImageKit CDN**.
  - Add/Edit/Delete movies from **MongoDB Atlas**.
  - Configure dynamic download links (Google Drive, Mega, Fast Cloud).

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dev998889/vegamovies.git
cd vegamovies
```

### 2. Install & Start Backend
```bash
cd server
npm install
# Set up .env with your MongoDB & ImageKit credentials (refer to .env.example)
npm run dev
```

### 3. Install & Start Frontend
```bash
# In the root directory:
npm install
npm run dev
```
Open `http://localhost:5180/` in your browser.

## 🔐 Super Admin Access
- Press `Ctrl + Shift + A` anywhere on the site.
- Passkey: `vega@superadmin2026`
