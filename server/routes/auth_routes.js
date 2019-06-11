import express from 'express';

let router = express.Router();

const routes = {
  '/form/advanced-form': { authority: ['admin', 'writer', 'user'] },
};

router.get('/', (req, res) => {
  res.json(routes);
});

export default router;
