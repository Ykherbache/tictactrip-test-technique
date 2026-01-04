import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after a minute',
});
