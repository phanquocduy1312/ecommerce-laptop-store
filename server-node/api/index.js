import { app } from '../src/index.js';

// Export handler for Vercel
export default (req, res) => {
  app(req, res);
};
