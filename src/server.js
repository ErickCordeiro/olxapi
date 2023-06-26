import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongoConnect } from './database/connect.js'
import cors from 'cors';
import fileUpload from 'express-fileupload';
import Routers from './routers/routers.js';

dotenv.config();
mongoConnect();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', Routers);
app.use(fileUpload());

app.listen(process.env.PORT);