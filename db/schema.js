import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").notNull(),
    fullName: text("full_name"),
    lastActiveAt: timestamp("last_active_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
});


export const vaults = pgTable("vaults", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(), // consider encrypting before saving
    visibility: text("visibility").default("private"), // or public/private/trusted_only
    createdAt: timestamp("created_at").defaultNow(),
});


export const trustedContacts = pgTable("trusted_contacts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    relationship: text("relationship"), // friend, sibling, etc.
    createdAt: timestamp("created_at").defaultNow(),
});


export const vaultRecipients = pgTable("vault_recipients", {
    id: uuid("id").primaryKey().defaultRandom(),
    vaultId: uuid("vault_id").notNull().references(() => vaults.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id").notNull().references(() => trustedContacts.id, { onDelete: "cascade" }),
    customMessage: text("custom_message"), // optional final note for that person
});


export const triggers = pgTable("triggers", {
    id: uuid("id").primaryKey().defaultRandom(),
    vaultId: uuid("vault_id").notNull().references(() => vaults.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // "inactivity", "scheduled", "manual"
    scheduledAt: timestamp("scheduled_at"), // if type === "scheduled"
    inactivityDays: text("inactivity_days"), // if type === "inactivity"
    createdAt: timestamp("created_at").defaultNow(),
});

