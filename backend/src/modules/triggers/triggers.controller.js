import triggersService from './triggers.service.js';

class TriggersController {
    async addTrigger(req, res) {
        try {
            const { vaultId, type, triggerDate, inactivityDays, recipients } = req.body;
            
            if (!vaultId || !type || !recipients || recipients.length === 0) {
                return res.status(400).json({ message: 'Missing required fields or no recipients provided' });
            }
            
            const result = await triggersService.addTrigger(vaultId, { 
                type, 
                triggerDate, 
                inactivityDays, 
                recipients
            });
            
            res.status(201).json({ message: 'Trigger and recipients added successfully', data: result });
        } catch (error) {
            console.error('Add Trigger Error:', error);
            res.status(500).json({ message: 'Error adding trigger' });
        }
    }
}

export default new TriggersController();
