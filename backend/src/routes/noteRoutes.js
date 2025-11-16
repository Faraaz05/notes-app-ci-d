import express from 'express';
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getTags,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Tags route - Must come BEFORE /:id route
router.get('/tags/all', getTags);

// Note routes
router.route('/').get(getNotes).post(createNote);

router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);

export default router;
