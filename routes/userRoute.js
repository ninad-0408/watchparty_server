import express from 'express';

import { userLogin, userSignup } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/validity.js';
import { myRoom } from '../controllers/roomController.js';

const router = express.Router();

router.post('/login', userLogin);
router.post('/signup', userSignup);
router.get('/myRoom',isLoggedIn,myRoom);

export default router;