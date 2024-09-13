const express = require('express');
const upload = require('../config/upload');
const path = require('path');
const authenticateToken = require('../middleware/authMiddleware');
const {
  createFilm,
  getFilms,
  getFilmById,
  updateFilm,
  deleteFilm,
} = require('../controllers/filmController');
const { register, login, logout } = require('../controllers/auth/authController');
const router = express.Router();

// Set default endpoint response
router.get("/", function (req, res) {
  res.json({
    status: "API It's Working",
    message: "Welcome to api!",
  });
});

router.use('/videos', express.static(path.join(__dirname, '../storage/videos')));

// Auth endpoints
router.post('/users/register', register);
router.post('/users/signin', login);

// middleware endpoints
router.use('/films', authenticateToken);

router.post('/films', upload.single('image_thumbnail'), createFilm);
router.get('/films', getFilms);
router.get('/films/:id', getFilmById);
router.put('/films/:id', upload.single('image_thumbnail'), updateFilm);
router.delete('/films/:id', deleteFilm);

module.exports = router;
