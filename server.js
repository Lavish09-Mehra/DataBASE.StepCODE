import express from 'express';
import routes from './node-storage/DataBaseJS/routes/storageRoutes.js';
import { errorHandler } from './node-storage/DataBaseJS/middleware/errorHandler.js';
import { notFound } from './node-storage/DataBaseJS/middleware/notFound.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`node-storage running on port ${PORT}`);
});
