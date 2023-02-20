import express from 'express';
import * as dotenv from 'dotenv';

import preMiddleware from './middlewares/pre.middleware';
import Routes from './routes';

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express();

// Pre middleware 
preMiddleware(app)

// Routes
app.use("/", Routes)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))