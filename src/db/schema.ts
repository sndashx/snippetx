import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Supabase Auth UUID
  email: text("email").notNull().unique(),
  stripeAccountId: text("stripe_account_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const snippets = pgTable("snippets", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: text("seller_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  language: text("language").notNull(),
  filePath: text("file_path").notNull(), // Path in Cloudflare R2
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: text("buyer_id").references(() => users.id).notNull(),
  snippetId: uuid("snippet_id").references(() => snippets.id).notNull(),
  amount: integer("amount").notNull(), // Amount paid in cents
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
