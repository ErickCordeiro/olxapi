import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongoConnect } from "./src/database/connect.js"
import cors from 'cors';
import fileUpload from 'express-fileupload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
mongoConnect();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.get('/ping', (request, response) => {
    return response.json({pong: true})
});

app.listen(process.env.PORT);