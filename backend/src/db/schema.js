import { date, pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    isVerified: boolean("is_verified").default(false),
    fullName: text("full_name"),
    publicKey: text("public_key"),
    encryptedPrivateKey: text("encrypted_private_key"),
    salt: text("salt"),
    lastActiveAt: timestamp("last_active_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
});


export const vaults = pgTable("vaults", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    ciphertext: text("ciphertext").notNull(),
    iv: text("iv").notNull(),
    encryptedDekOwner: text("encrypted_dek_owner").notNull(),
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
    encryptedDekNominee: text("encrypted_dek_nominee"),
    isUnlocked: boolean("is_unlocked").default(false),
});


export const triggers = pgTable("triggers", {
    id: uuid("id").primaryKey().defaultRandom(),
    vaultId: uuid("vault_id").notNull().references(() => vaults.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // "inactivity", "scheduled", "manual"
    triggerDate: date("trigger_date"),
    inactivityDays: text("inactivity_days"), // if type === "inactivity"
    createdAt: timestamp("created_at").defaultNow(),
});

export const otps = pgTable("otps", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    otp: text("otp").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

