import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongoConnect } from './database/connect.js'
import cors from 'cors';
import fileUpload from 'express-fileupload';
import Routers from './routers/routers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
mongoConnect();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', Routers);
app.use(fileUpload());

app.listen(process.env.PORT);