const mongoose = require('mongoose');

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
    emotion: String,
    score: Number,
    percentage: Number
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

module.exports = mongoose.models.EmotionAnalysis || mongoose.model('EmotionAnalysis', emotionSchema);
