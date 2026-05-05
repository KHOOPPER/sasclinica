-- Migration: Add map coordinates and zoom to public_clinic_settings
ALTER TABLE public_clinic_settings
ADD COLUMN IF NOT EXISTS map_coordinates TEXT, -- e.g. "13.6929,-89.2182"
ADD COLUMN IF NOT EXISTS map_zoom INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS map_type TEXT DEFAULT 'roadmap'; -- roadmap, satellite, terrain, hybrid
