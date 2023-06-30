import express from 'express';
import dotenv from 'dotenv';
import { mongoConnect } from './database/connect.js'
import cors from 'cors';
import fileUpload from 'express-fileupload';
import Routers from './routers/routers.js';

dotenv.config();
mongoConnect();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({limit: '50mb',extended: true }));
app.use('/api/v1', Routers);
app.use(fileUpload());

app.listen(process.env.PORT);