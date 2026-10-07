-- ============================================================================
-- Automotive Inventory Management System: PostgreSQL Production DDL Schema
-- Compatible with PostgreSQL 13+ (Supabase, Neon, AWS RDS, GCP Cloud SQL)
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE vehicle_condition AS ENUM ('new', 'used', 'certified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_status AS ENUM ('available', 'sold', 'reserved', 'pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE fuel_type AS ENUM (
    'gasoline',
    'diesel',
    'electric',
    'hybrid',
    'plug_in_hybrid',
    'hydrogen'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transmission AS ENUM (
    'automatic',
    'manual',
    'dual_clutch',
    'cvt',
    'direct_drive'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE drivetrain AS ENUM ('awd', 'fwd', 'rwd', '4wd');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'sales', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_type AS ENUM (
    'test_drive',
    'general_inquiry',
    'purchase_offer',
    'financing'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM (
    'new',
    'contacted',
    'appointment_scheduled',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. USERS TABLE (Role-Based Access Control)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  phone_number VARCHAR(32),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================================================
-- 3. VEHICLES TABLE (Inventory Entity)
-- ============================================================================

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin VARCHAR(17) NOT NULL UNIQUE,
  make VARCHAR(64) NOT NULL,
  model VARCHAR(64) NOT NULL,
  year INTEGER NOT NULL,
  trim VARCHAR(64),
  mileage INTEGER NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  fuel_type fuel_type NOT NULL,
  transmission transmission NOT NULL,
  drivetrain drivetrain NOT NULL,
  exterior_color VARCHAR(64) NOT NULL,
  interior_color VARCHAR(64) NOT NULL,
  condition vehicle_condition NOT NULL,
  status vehicle_status NOT NULL DEFAULT 'available',
  features TEXT[] NOT NULL DEFAULT '{}',
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  primary_image_index INTEGER NOT NULL DEFAULT 0,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT chk_vehicle_vin_len CHECK (char_length(vin) = 17),
  CONSTRAINT chk_vehicle_year CHECK (year >= 1900 AND year <= 2100),
  CONSTRAINT chk_vehicle_mileage CHECK (mileage >= 0),
  CONSTRAINT chk_vehicle_price CHECK (price >= 0),
  CONSTRAINT chk_vehicle_primary_image CHECK (primary_image_index >= 0)
);

-- B-Tree Indexes for fast lookups & filtering
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_mileage ON vehicles(mileage);
CREATE INDEX IF NOT EXISTS idx_vehicles_condition ON vehicles(condition);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);

-- GIN Index for fast array containment search on features (e.g. features @> ARRAY['Carbon Ceramic Brakes'])
CREATE INDEX IF NOT EXISTS idx_vehicles_features_gin ON vehicles USING GIN(features);

-- GIN Index for high-performance JSONB querying into specifications
CREATE INDEX IF NOT EXISTS idx_vehicles_specs_gin ON vehicles USING GIN(specs jsonb_path_ops);

-- ============================================================================
-- 4. LEADS TABLE (Test Drive Requests & Client Inquiries)
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  lead_type lead_type NOT NULL DEFAULT 'test_drive',
  status lead_status NOT NULL DEFAULT 'new',
  preferred_date DATE,
  preferred_time_slot VARCHAR(64),
  has_valid_driver_license BOOLEAN NOT NULL DEFAULT true,
  message TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_vehicle_id ON leads(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_user ON leads(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ============================================================================
-- 5. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to all tables
DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON vehicles;
CREATE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_leads_updated_at ON leads;
CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
