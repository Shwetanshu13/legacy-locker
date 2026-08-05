import contactsService from './contacts.service.js';

class ContactsController {
    async getContacts(req, res) {
        try {
            const userId = req.user.id;
            const contacts = await contactsService.getContacts(userId);
            res.status(200).json({ contacts });
        } catch (error) {
            console.error('Get Contacts Error:', error);
            res.status(500).json({ message: 'Error fetching contacts' });
        }
    }

    async addContact(req, res) {
        try {
            const { name, email } = req.body;
            const userId = req.user.id;
            
            if (!name || !email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            
            const newContact = await contactsService.addContact(userId, { name, email });
            res.status(201).json({ message: 'Contact added successfully', contact: newContact });
        } catch (error) {
            console.error('Add Contact Error:', error);
            res.status(500).json({ message: 'Error adding contact' });
        }
    }
}

export default new ContactsController();
