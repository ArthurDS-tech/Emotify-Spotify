// === src/models/User.js ===
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  spotifyId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  name: String,
  password: String,
  profileImage: String,
  country: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  tokenExpiresAt: Date,
  refreshToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastAnalysis: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

// === src/models/EmotionAnalysis.js ===
const emotionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['short_term', 'medium_term', 'long_term'],
    required: true
  },
  dominantEmotion: String,
  emotionalBalance: Number,
  emotionBreakdown: {
    alegria: Number,
    melancolia: Number,
    nostalgia: Number,
    calma: Number,
    euforia: Number,
    introspecção: Number,
    energia: Number
  },
  emotionalTimeline: [{
    day: String,
    emotion: String,
    score: Number
  }],
  insights: [String],
  trackCount: Number,
  averageAudioFeatures: {
    danceability: Number,
    energy: Number,
    acousticness: Number,
    valence: Number,
    instrumentalness: Number,
    tempo: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmotionAnalysis', emotionSchema);

// === src/models/TrackCache.js ===
const trackCacheSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  spotifyTrackId: String,
  name: String,
  artist: String,
  audioFeatures: {
    danceability: Number,
    energy: Number,
    key: Number,
    loudness: Number,
    mode: Number,
    speechiness: Number,
    acousticness: Number,
    instrumentalness: Number,
    liveness: Number,
    valence: Number,
    tempo: Number,
    timeSignature: Number
  },
  playedAt: Date,
  cachedAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 dias
  }
});

module.exports = mongoose.model('TrackCache', trackCacheSchema);