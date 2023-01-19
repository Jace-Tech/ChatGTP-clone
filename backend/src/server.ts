import express from 'express';
import * as dotenv from 'dotenv';

import errorMiddleware from './middlewares/error.middleware';
import preMiddleware from './middlewares/pre.middleware';
import Routes from './routes';
import database from "./config/database"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express();

// Pre middleware 
preMiddleware(app)

// Routes
app.use("/", Routes)

// Error middleware
errorMiddleware(app)

database(() => {
  app.listen(PORT, () => { 
    console.log("Server running...")
  });  
})
