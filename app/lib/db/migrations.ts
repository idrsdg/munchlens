// Drizzle migration helper
// Kullanım: npx drizzle-kit push
// Ya da: npx tsx lib/db/migrate.ts

import { db } from "./index";
import { sql } from "drizzle-orm";

export async function createEnumsIfNotExists() {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE meal_type AS ENUM ('kahvalti', 'ogle', 'aksam', 'ara_ogun');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE goal_type AS ENUM ('ver', 'kor', 'al');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE activity_level AS ENUM ('hareketsiz', 'az_aktif', 'orta', 'cok_aktif');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE diet_type AS ENUM ('normal', 'vegan', 'vejetaryen', 'keto', 'paleo', 'glutensiz', 'helal');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE plan_status AS ENUM ('active', 'canceled', 'trialing', 'past_due');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);
}
