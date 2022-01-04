import express from 'express';

import { createRoom, patchRoom, delRoom, getRooms } from '../controllers/roomController.js';
import { isLoggedIn } from '../middlewares/validity.js';

const router = express.Router();

router.get('/',isLoggedIn, getRooms);
router.post('/create', isLoggedIn, createRoom);
router.patch('/:roomId', isLoggedIn, patchRoom);
router.delete('/:roomId', isLoggedIn, delRoom);

export default router;