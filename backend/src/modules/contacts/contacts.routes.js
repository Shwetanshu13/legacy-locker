import express from 'express';
import contactsController from './contacts.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', contactsController.getContacts);
router.post('/add', contactsController.addContact);

export default router;
