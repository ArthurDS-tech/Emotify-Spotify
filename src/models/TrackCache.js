const mongoose = require('mongoose');

const trackCacheSchema = new mongoose.Schema({
  spotifyId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  artists: [String],
  album: String,
  audioFeatures: {
    danceability: Number,
    energy: Number,
    valence: Number,
    acousticness: Number,
    instrumentalness: Number,
    tempo: Number,
    duration_ms: Number
  },
  popularity: Number,
  preview_url: String,
  external_urls: {
    spotify: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 horas
  }
});

module.exports = mongoose.model('TrackCache', trackCacheSchema);