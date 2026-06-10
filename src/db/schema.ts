import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  primaryKey,
  boolean,
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
  wishedPrice: integer("wished_price").notNull(),
  lastNotifiedPrice: integer("last_notified_price"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.snippetId] }),
}));

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  used: boolean("used").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  subscriptionPlan: text("subscription_plan")
    .default("pro")
    .notNull(),
  subscriptionStatus: text("subscription_status")
    .default("active")
    .notNull(),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  maxMembers: integer("max_members").default(5).notNull(),
  maxSnippets: integer("max_snippets").default(50).notNull(),
  maxStorage: integer("max_storage").default(10240).notNull(), // in MB
  monthlyPrice: integer("monthly_price").default(2999).notNull(), // in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  role: text("role").default("member").notNull(), // owner, admin, member
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const teamSubscriptions = pgTable("team_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status").default("active").notNull(), // active, past_due, canceled
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const premiumVetting = pgTable("premium_vetting", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  verificationType: text("verification_type").notNull(), // identity, business, portfolio
  submissionDate: timestamp("submission_date").defaultNow().notNull(),
  reviewDate: timestamp("review_date"),
  reviewerId: uuid("reviewer_id").references(() => users.id),
  notes: text("notes"),
  documents: jsonb("documents"), // URLs to verification documents
  completedAt: timestamp("completed_at"),
});

export const verifiedBadges = pgTable("verified_badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  badgeType: text("badge_type").notNull(), // verified_seller, premium_support, expert
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  issuerId: uuid("issuer_id").references(() => users.id),
  requirements: jsonb("requirements"), // JSON object with badge requirements
});

export const bounties = pgTable("bounties", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: text("language").notNull(),
  budget: integer("budget").notNull(), // in cents
  status: text("status").default("open").notNull(), // open, in_progress, completed, closed
  assigneeId: uuid("assignee_id").references(() => users.id),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



