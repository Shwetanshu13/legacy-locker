import db from '../../db/index.js';
import { trustedContacts } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

class ContactsService {
    async getContacts(userId) {
        return await db
            .select()
            .from(trustedContacts)
            .where(eq(trustedContacts.userId, userId));
    }

    async addContact(userId, { name, email }) {
        const [newContact] = await db
            .insert(trustedContacts)
            .values({
                userId,
                name,
                email
            })
            .returning();
        return newContact;
    }
}

export default new ContactsService();
