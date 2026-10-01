import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const mealTypeEnum = pgEnum("meal_type", [
  "kahvalti",
  "ogle",
  "aksam",
  "ara_ogun",
]);
export const goalTypeEnum = pgEnum("goal_type", ["ver", "kor", "al"]);
export const activityLevelEnum = pgEnum("activity_level", [
  "hareketsiz",
  "az_aktif",
  "orta",
  "cok_aktif",
]);
export const dietTypeEnum = pgEnum("diet_type", [
  "normal",
  "vegan",
  "vejetaryen",
  "keto",
  "paleo",
  "glutensiz",
  "helal",
]);
export const planStatusEnum = pgEnum("plan_status", [
  "active",
  "canceled",
  "trialing",
  "past_due",
]);

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  password: text("password"),
  emailVerified: timestamp("email_verified"),
  // Profil
  age: integer("age"),
  gender: text("gender"), // male | female | other
  heightCm: real("height_cm"),
  weightKg: real("weight_kg"),
  targetWeightKg: real("target_weight_kg"),
  goalType: goalTypeEnum("goal_type").default("kor"),
  activityLevel: activityLevelEnum("activity_level").default("orta"),
  dailyCalorieGoal: integer("daily_calorie_goal"),
  proteinGoalG: integer("protein_goal_g"),
  carbGoalG: integer("carb_goal_g"),
  fatGoalG: integer("fat_goal_g"),
  waterGoalMl: integer("water_goal_ml").default(2000),
  dietType: dietTypeEnum("diet_type").default("normal"),
  allergies: jsonb("allergies").$type<string[]>().default([]),
  language: text("language").default("tr"),
  theme: text("theme").default("light"),
  unitSystem: text("unit_system").default("metric"), // metric | imperial
  // Abonelik
  isPro: boolean("is_pro").default(false),
  // Streak
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastLogDate: text("last_log_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Auth.js required tables
export const accounts = pgTable("accounts", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
});

// Food Logs
export const foodLogs = pgTable("food_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  mealType: mealTypeEnum("meal_type").notNull(),
  foodName: text("food_name").notNull(),
  portionGrams: real("portion_grams"),
  portionDescription: text("portion_description"), // "1 porsiyon", "1 bardak"
  calories: real("calories").notNull(),
  proteinG: real("protein_g").default(0),
  carbG: real("carb_g").default(0),
  fatG: real("fat_g").default(0),
  fiberG: real("fiber_g").default(0),
  // Kaynak
  source: text("source").default("manual"), // photo | barcode | search | manual
  imageUrl: text("image_url"),
  recipeId: text("recipe_id"),
  barcode: text("barcode"),
  aiConfidence: real("ai_confidence"), // 0-1, fotoğraf analizinden
  loggedAt: timestamp("logged_at").defaultNow(),
});

// Weight Logs
export const weightLogs = pgTable("weight_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  weightKg: real("weight_kg").notNull(),
  notes: text("notes"),
  loggedAt: timestamp("logged_at").defaultNow(),
});

// Water Logs
export const waterLogs = pgTable("water_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  amountMl: integer("amount_ml").notNull().default(250),
  loggedAt: timestamp("logged_at").defaultNow(),
});

// Saved Recipes
export const savedRecipes = pgTable("saved_recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recipeId: text("recipe_id").notNull(),
  recipeTitle: text("recipe_title").notNull(),
  recipeImage: text("recipe_image"),
  calories: real("calories"),
  servings: integer("servings"),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Meal Plans (AI haftalık planlar)
export const mealPlans = pgTable("meal_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  weekStartDate: text("week_start_date").notNull(),
  planData: jsonb("plan_data").notNull(), // 7 gün × 4 öğün yapısı
  totalCaloriesAvg: real("total_calories_avg"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shopping Lists
export const shoppingLists = pgTable("shopping_lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mealPlanId: uuid("meal_plan_id").references(() => mealPlans.id),
  title: text("title").default("Alışveriş Listesi"),
  items: jsonb("items")
    .notNull()
    .$type<
      Array<{
        name: string;
        category: string;
        checked: boolean;
        quantity?: string;
      }>
    >(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  status: planStatusEnum("status").default("active"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievements
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementKey: text("achievement_key").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Rate Limiting (Redis ile desteklenir, bu tablo fallback)
export const rateLimitLogs = pgTable("rate_limit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  action: text("action").notNull(), // photo_analysis | recipe_suggest | plan_create
  date: text("date").notNull(),
  count: integer("count").default(1),
});
