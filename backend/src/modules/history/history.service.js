import db from '../../db/index.js';
import { triggerHistory } from '../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

class HistoryService {
    async getUserHistory(userId) {
        return await db
            .select()
            .from(triggerHistory)
            .where(eq(triggerHistory.userId, userId))
            .orderBy(desc(triggerHistory.triggeredAt));
    }
}

export default new HistoryService();
