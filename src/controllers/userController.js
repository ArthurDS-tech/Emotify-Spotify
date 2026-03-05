const supabaseService = require('../services/supabaseService');
const emotionEngine = require('../services/emotionEngine');
const logger = require('../utils/logger');

class UserController {
  async getProfile(req, res) {
    try {
      const user = await supabaseService.getUserById(req.user.userId);
      const insights = await supabaseService.getUserInsights(req.user.userId);

      const { spotify_access_token, spotify_refresh_token, ...safeUser } = user;

      res.json({ user: safeUser, insights });
    } catch (error) {
      logger.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  async getListeningHistory(req, res) {
    try {
      const { limit = 100 } = req.query;
      const history = await supabaseService.getUserListeningHistory(
        req.user.userId,
        parseInt(limit)
      );

      res.json({ history });
    } catch (error) {
      logger.error('Error fetching listening history:', error);
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  }

  async findCompatibleUsers(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      // Get current user's emotion profile
      const userAnalyses = await supabaseService.getUserEmotionAnalyses(req.user.userId, 100);
      
      if (!userAnalyses || userAnalyses.length === 0) {
        return res.json({ compatibleUsers: [] });
      }

      // Calculate average emotions
      const userEmotions = this.calculateAverageEmotions(userAnalyses);

      // This is a simplified version - in production, you'd query other users more efficiently
      // For now, return empty array as we need more complex querying
      res.json({ 
        compatibleUsers: [],
        message: 'Feature coming soon - requires more users'
      });
    } catch (error) {
      logger.error('Error finding compatible users:', error);
      res.status(500).json({ error: 'Failed to find compatible users' });
    }
  }

  async getConnections(req, res) {
    try {
      const { status = 'accepted' } = req.query;
      const connections = await supabaseService.getUserConnections(
        req.user.userId,
        status
      );

      res.json({ connections });
    } catch (error) {
      logger.error('Error fetching connections:', error);
      res.status(500).json({ error: 'Failed to fetch connections' });
    }
  }

  calculateAverageEmotions(analyses) {
    const totals = {
      joy: 0, sadness: 0, energy: 0, calm: 0,
      nostalgia: 0, euphoria: 0, introspection: 0
    };

    analyses.forEach(a => {
      totals.joy += parseFloat(a.joy_score || 0);
      totals.sadness += parseFloat(a.sadness_score || 0);
      totals.energy += parseFloat(a.energy_score || 0);
      totals.calm += parseFloat(a.calm_score || 0);
      totals.nostalgia += parseFloat(a.nostalgia_score || 0);
      totals.euphoria += parseFloat(a.euphoria_score || 0);
      totals.introspection += parseFloat(a.introspection_score || 0);
    });

    const count = analyses.length;
    const averages = {};
    for (const emotion in totals) {
      averages[emotion] = totals[emotion] / count;
    }

    return averages;
  }
}

module.exports = new UserController();
