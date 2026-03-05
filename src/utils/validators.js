const validators = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidSpotifyId: (id) => {
    return typeof id === 'string' && id.length > 0;
  },

  isValidPeriod: (period) => {
    return ['short_term', 'medium_term', 'long_term'].includes(period);
  },

  isValidLimit: (limit) => {
    const num = parseInt(limit);
    return !isNaN(num) && num > 0 && num <= 50;
  },

  sanitizeString: (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().substring(0, 500);
  }
};

module.exports = validators;