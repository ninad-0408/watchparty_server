import express from 'express';

import { createRoom, patchRoom, delRoom } from '../controllers/roomController.js';
import { isLoggedIn, isValid } from '../middlewares/validity.js';

const router = express.Router();

router.post('/create', isLoggedIn, createRoom);
router.patch('/:roomId', isValid, isLoggedIn, patchRoom);
router.delete('/:roomId', isValid, isLoggedIn, delRoom);

export default router;