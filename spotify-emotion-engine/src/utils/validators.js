const Joi = require('joi');

const schemas = {
  emotionQuery: Joi.object({
    period: Joi.string().valid('short_term', 'medium_term', 'long_term'),
    limit: Joi.number().min(1).max(50)
  })
};

const validate = (schema, data) => {
  const { error, value } = schema.validate(data);
  return error ? { valid: false, errors: error.details } : { valid: true, value };
};

module.exports = { schemas, validate };
