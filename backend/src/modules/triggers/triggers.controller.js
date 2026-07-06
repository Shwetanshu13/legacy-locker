import triggersService from './triggers.service.js';

class TriggersController {
    async addTrigger(req, res) {
        try {
            const { vaultId, type, triggerDate, inactivityDays, contactId, encryptedDekNominee, customMessage } = req.body;
            
            if (!vaultId || !type || !contactId || !encryptedDekNominee) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            
            const result = await triggersService.addTrigger(vaultId, { 
                type, 
                triggerDate, 
                inactivityDays, 
                contactId, 
                encryptedDekNominee, 
                customMessage 
            });
            
            res.status(201).json({ message: 'Trigger and recipient added successfully', data: result });
        } catch (error) {
            console.error('Add Trigger Error:', error);
            res.status(500).json({ message: 'Error adding trigger' });
        }
    }
}

export default new TriggersController();
