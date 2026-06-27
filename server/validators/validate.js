import '../config/env.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.').replace(/^(body|query|params)\./, ''),
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = result.data.body;
  req.query = result.data.query;
  req.params = result.data.params;

  next();
};
