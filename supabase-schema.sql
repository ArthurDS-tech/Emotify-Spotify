-- Emotify Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spotify_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  profile_image TEXT,
  country VARCHAR(10),
  spotify_access_token TEXT,
  spotify_refresh_token TEXT,
  token_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW()
);

-- Emotion analyses table
CREATE TABLE IF NOT EXISTS emotion_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id VARCHAR(255) NOT NULL,
  track_name VARCHAR(500),
  artist_name VARCHAR(500),
  album_name VARCHAR(500),
  album_image TEXT,
  
  -- Audio features
  valence DECIMAL(5,4),
  energy DECIMAL(5,4),
  danceability DECIMAL(5,4),
  acousticness DECIMAL(5,4),
  instrumentalness DECIMAL(5,4),
  speechiness DECIMAL(5,4),
  liveness DECIMAL(5,4),
  tempo DECIMAL(7,3),
  loudness DECIMAL(7,3),
  mode INTEGER,
  key INTEGER,
  duration_ms INTEGER,
  time_signature INTEGER,
  
  -- Emotion scores
  joy_score DECIMAL(5,4),
  sadness_score DECIMAL(5,4),
  energy_score DECIMAL(5,4),
  calm_score DECIMAL(5,4),
  nostalgia_score DECIMAL(5,4),
  euphoria_score DECIMAL(5,4),
  introspection_score DECIMAL(5,4),
  
  -- Primary emotion
  primary_emotion VARCHAR(50),
  emotion_intensity DECIMAL(5,4),
  
  analyzed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, track_id)
);

-- User listening history
CREATE TABLE IF NOT EXISTS listening_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id VARCHAR(255) NOT NULL,
  track_name VARCHAR(500),
  artist_name VARCHAR(500),
  played_at TIMESTAMP NOT NULL,
  context_type VARCHAR(50),
  context_uri TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  spotify_playlist_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  emotion_theme VARCHAR(50),
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  image_url TEXT,
  track_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Playlist tracks
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  track_id VARCHAR(255) NOT NULL,
  track_name VARCHAR(500),
  artist_name VARCHAR(500),
  added_by UUID REFERENCES users(id),
  added_at TIMESTAMP DEFAULT NOW(),
  position INTEGER,
  
  UNIQUE(playlist_id, track_id)
);

-- User insights (aggregated data)
CREATE TABLE IF NOT EXISTS user_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Top emotions
  top_emotion VARCHAR(50),
  top_emotion_percentage DECIMAL(5,2),
  
  -- Averages
  avg_valence DECIMAL(5,4),
  avg_energy DECIMAL(5,4),
  avg_danceability DECIMAL(5,4),
  
  -- Listening patterns
  total_tracks_analyzed INTEGER DEFAULT 0,
  total_listening_time_ms BIGINT DEFAULT 0,
  favorite_genres JSONB,
  top_artists JSONB,
  
  -- Temporal patterns
  most_active_hour INTEGER,
  most_active_day VARCHAR(20),
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User connections (social features)
CREATE TABLE IF NOT EXISTS user_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  connected_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(5,4),
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, connected_user_id),
  CHECK (user_id != connected_user_id)
);

-- Track cache (to avoid repeated Spotify API calls)
CREATE TABLE IF NOT EXISTS track_cache (
  track_id VARCHAR(255) PRIMARY KEY,
  track_data JSONB NOT NULL,
  audio_features JSONB,
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);

-- Create indexes for better performance
CREATE INDEX idx_users_spotify_id ON users(spotify_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_emotion_analyses_user_id ON emotion_analyses(user_id);
CREATE INDEX idx_emotion_analyses_track_id ON emotion_analyses(track_id);
CREATE INDEX idx_emotion_analyses_primary_emotion ON emotion_analyses(primary_emotion);
CREATE INDEX idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX idx_listening_history_played_at ON listening_history(played_at);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX idx_user_connections_user_id ON user_connections(user_id);
CREATE INDEX idx_track_cache_expires_at ON track_cache(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_insights_updated_at BEFORE UPDATE ON user_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Emotion analyses policies
CREATE POLICY "Users can view own analyses" ON emotion_analyses
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own analyses" ON emotion_analyses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Listening history policies
CREATE POLICY "Users can view own history" ON listening_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own history" ON listening_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Playlists policies
CREATE POLICY "Users can view own playlists" ON playlists
  FOR SELECT USING (auth.uid()::text = user_id::text OR is_public = true);

CREATE POLICY "Users can manage own playlists" ON playlists
  FOR ALL USING (auth.uid()::text = user_id::text);

-- User insights policies
CREATE POLICY "Users can view own insights" ON user_insights
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own insights" ON user_insights
  FOR ALL USING (auth.uid()::text = user_id::text);
