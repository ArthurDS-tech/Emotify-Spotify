const mongoose = require('mongoose');

const emotionAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['short_term', 'medium_term', 'long_term'],
    default: 'medium_term'
  },
  dominantEmotion: String,
  emotionalBalance: Number,
  emotionalTimeline: [{
    date: Date,
    emotion: String,
    intensity: Number
  }],
  insights: [String],
  emotionBreakdown: {
    alegria: Number,
    melancolia: Number,
    nostalgia: Number,
    calma: Number,
    euforia: Number,
    introspecção: Number,
    energia: Number
  },
  averageAudioFeatures: {
    danceability: Number,
    energy: Number,
    valence: Number,
    acousticness: Number,
    instrumentalness: Number,
    tempo: Number
  },
  trackCount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmotionAnalysis', emotionAnalysisSchema);