import express from 'express';
import contactsController from './contacts.controller.js';
import authMiddleware from '../../middleware/auth.js';
import { cacheMiddleware } from '../../middleware/cache.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', cacheMiddleware('contacts'), contactsController.getContacts);
router.post('/add', contactsController.addContact);

export default router;
