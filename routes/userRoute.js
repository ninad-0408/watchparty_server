import express from 'express';

import { userLogin, userSignup, getUsers } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/validity.js';

const router = express.Router();

router.post('/login', userLogin);
router.post('/signup', userSignup);
router.get('/', isLoggedIn, getUsers);

export default router;