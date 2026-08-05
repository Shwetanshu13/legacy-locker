import historyService from './history.service.js';

class HistoryController {
    async getHistory(req, res) {
        try {
            const userId = req.user.id;
            const history = await historyService.getUserHistory(userId);
            res.status(200).json({ data: history });
        } catch (error) {
            console.error('Get History Error:', error);
            res.status(500).json({ message: 'Error fetching history' });
        }
    }
}

export default new HistoryController();
