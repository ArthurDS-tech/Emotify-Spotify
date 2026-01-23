const mongoose = require('mongoose');

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
    expires: 2592000
  }
});

module.exports = mongoose.models.TrackCache || mongoose.model('TrackCache', trackCacheSchema);
