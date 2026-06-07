import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  stripeAccountId: text("stripe_account_id"),
  stripeAccountStatus: text("stripe_account_status")
    .default("inactive")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .references(() => users.id)
    .primaryKey(),
  bio: text("bio"),
  website: text("website"),
  github: text("github"),
  twitter: text("twitter"),
  totalSales: integer("total_sales").default(0).notNull(),
  rating: integer("rating").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const snippets = pgTable("snippets", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: text("language").notNull(),
  price: integer("price").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  previewImage: text("preview_image"),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const versions = pgTable("versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  snippetId: uuid("snippet_id")
    .references(() => snippets.id)
    .notNull(),
  versionNumber: integer("version_number").notNull(),
  changelog: text("changelog"),
  filePath: text("file_path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: uuid("buyer_id")
    .references(() => users.id)
    .notNull(),
  sellerId: uuid("seller_id")
    .references(() => users.id)
    .notNull(),
  snippetId: uuid("snippet_id")
    .references(() => snippets.id)
    .notNull(),
  amount: integer("amount").notNull(),
  platformFee: integer("platform_fee").notNull(),
  status: text("status").default("pending").notNull(),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  downloadUrl: text("download_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  snippetId: uuid("snippet_id")
    .references(() => snippets.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishlists = pgTable("wishlists", {
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  snippetId: uuid("snippet_id")
    .references(() => snippets.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.snippetId] }),
}));

export const bundles = pgTable("bundles", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bundleItems = pgTable("bundle_items", {
  bundleId: uuid("bundle_id")
    .references(() => bundles.id)
    .notNull(),
  snippetId: uuid("snippet_id")
    .references(() => snippets.id)
    .notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.bundleId, t.snippetId] }),
}));

