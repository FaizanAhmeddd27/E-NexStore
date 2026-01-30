import express from 'express';
import {
  signup,
  login,
  logout,
  getProfile,
  refreshToken
} from '../controllers/auth.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', upload.single('avatar'), signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protectRoute, getProfile);
router.post('/refresh-token', protectRoute, refreshToken);

export default router;